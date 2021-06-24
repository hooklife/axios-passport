import axios, { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
import { TokenUtils } from './tokenUtils';
import { IAxiosPassportConfig, AxiosPassportInstance } from './types'


export function createLoginMethod(
    instance: AxiosPassportInstance,
    axiosPassportConfig: IAxiosPassportConfig,
    tokenUtils: TokenUtils
): AxiosPassportInstance{
    instance.login = function (username: string, password: string, config: AxiosRequestConfig):Promise<any> {
        return new Promise((resolve, reject) => {
            instance.post(`${axiosPassportConfig.passportUrl}`, {
                grant_type: "password",
                client_id: axiosPassportConfig.clientId,
                client_secret: axiosPassportConfig.clientSecret,
                username: username,
                password: password,
                scope: axiosPassportConfig.scope
            }, { ...config,skipRefreshToken: true }).then((response) => {
                const { data } = response
                tokenUtils.setTokens({
                    isValidAccessToken: true,
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expires: data.expires_in,
                })
                resolve(response)
            }).catch(e => {
                reject(e)
            })
        })

    }
    return instance
}