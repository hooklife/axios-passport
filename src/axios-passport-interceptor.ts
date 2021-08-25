
import axios from 'axios';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IAxiosPassportConfig, IRefreshTokenResponse } from './types'
import { TokenUtils, IToken } from './token';



let isRefreshing = false;


type IRequestsQueue = {
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
}[]
let requestQueue: IRequestsQueue = [];

async function passportInterceptor(
    axiosInstance: AxiosInstance,
    requestConfig: AxiosRequestConfig,
    axiosPassportConfig: IAxiosPassportConfig
) {

    const source = axios.CancelToken.source()
    requestConfig.cancelToken = source.token


    if (requestConfig['skipRefreshToken']) {
        return requestConfig
    }
    if (!TokenUtils.getRefreshToken) {
        return requestConfig
    }

    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            requestQueue.push({ resolve, reject })
        }).then((token) => {
            requestConfig.headers['Authorization'] = 'Bearer ' + token
            return requestConfig
        }).catch(Promise.reject)
    }

    let accessToken
    try {
        accessToken = await refreshTokenIfNeeded(axiosInstance, axiosPassportConfig)
        resolveQueue(accessToken)
    } catch (error) {
        declineQueue(error)
        throw new Error(`Unable to refresh access token for request due to token refresh error: ${error.message}`)
    }

    // add token to headers
    requestConfig.headers['Authorization'] = `Bearer ${accessToken}`
    return requestConfig
}



const refreshTokenIfNeeded = async (instance: AxiosInstance, config: IAxiosPassportConfig) => {
    if (TokenUtils.isValidAccessToken()) {
        return TokenUtils.getAccessToken()
    }

    const refreshParams = {
        grant_type: 'refresh_token',
        refresh_token: TokenUtils.getRefreshToken(),
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: config.scope
    };

    try {
        isRefreshing = true 
        const { data } = await instance.post<IRefreshTokenResponse>(config.passportUrl, refreshParams, { skipRefreshToken: true });
        TokenUtils.setTokens({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expires: data.expires_in,
        })
        return data.access_token
    } catch (e) {
        requestQueue = []
        TokenUtils.removeTokens()
    } finally {
        isRefreshing = false
    }

};


const resolveQueue = (token: string) => {
    requestQueue.forEach((p) => {
        p.resolve(token)
    })
    requestQueue = []
}

const declineQueue = (error: Error) => {
    requestQueue.forEach((p) => {
        p.reject(error)
    })

    requestQueue = []
}

export function injectPassportInterceptor(instance: AxiosInstance, axiosPassportConfig: IAxiosPassportConfig) {
    // add an interceptor
    instance.interceptors.request.use((axiosRequestConfig: AxiosRequestConfig) => {
        const config = passportInterceptor(instance, axiosRequestConfig, axiosPassportConfig);
        return config;
    });
}