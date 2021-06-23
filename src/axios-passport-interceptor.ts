
import axios from 'axios';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IAxiosPassportConfig, IRefreshTokenResponse } from './types'
import { TokenUtils, ITokens } from './tokenUtils'



let isRefreshing = false;
let requestQueue = [];


function passportInterceptor(
    axiosInstance: AxiosInstance,
    axiosRequestConfig: AxiosRequestConfig,
    axiosPassportConfig: IAxiosPassportConfig,
    tokenUtils: TokenUtils
) {

    const tokens: ITokens = tokenUtils.getTokens()
    const source = axios.CancelToken.source()
    axiosRequestConfig.cancelToken = source.token


    if (axiosRequestConfig['skipRefreshToken']) {
        return axiosRequestConfig
    }


    if (tokens.isValidAccessToken) {
        axiosRequestConfig.headers['Authorization'] = 'Bearer ' + tokens.accessToken
        return axiosRequestConfig
    }

    if (!tokens.isValidAccessToken && !tokens.refreshToken) {
        source.cancel()
        return axiosRequestConfig
    }

    if (!isRefreshing) {
        refreshAccessToken(axiosInstance, tokens.refreshToken, axiosPassportConfig).then((response: AxiosResponse<IRefreshTokenResponse>) => {
            const { data } = response

            tokenUtils.setTokens({
                isValidAccessToken: true,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expires: data.expires_in,
            })

            axiosRequestConfig.headers['Authorization'] = 'Bearer ' + tokenUtils.getAccessToken()
            isRefreshing = false
            callRequestsFromQueue(tokens.accessToken);
            clearQueue(); // and clean queu
            return axiosRequestConfig
        }, () => {
            // 刷新失败
            isRefreshing = false
            clearQueue()
            tokenUtils.removeTokens()
        })
    }
    const requestQueue = new Promise(resolve => {
        // we push new function to queue
        addRequestToQueue(accessToken => {
            axiosRequestConfig.headers['Authorization'] = `Bearer ${accessToken}`
            resolve(axiosRequestConfig);
        });
    });

    return requestQueue;


}
const refreshAccessToken = (instance: AxiosInstance, refreshToken: String, config: IAxiosPassportConfig) => {
    const refreshParams = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: config.scope
    };
    return instance.post<IRefreshTokenResponse>(config.passportUrl, refreshParams, { skipRefreshToken: true });
};


const callRequestsFromQueue = accessToken => {
    requestQueue.forEach(callback => callback(accessToken));
};
const addRequestToQueue = callback => {
    requestQueue.push(callback);
};
const clearQueue = () => {
    requestQueue = [];
};


export function injectPassportInterceptor(instance: AxiosInstance, axiosPassportConfig: IAxiosPassportConfig, tokenUtils: TokenUtils) {
    // add an interceptor
    instance.interceptors.request.use((axiosRequestConfig: AxiosRequestConfig) => {
        const config = passportInterceptor(instance, axiosRequestConfig, axiosPassportConfig, tokenUtils);
        return config;
    });
}