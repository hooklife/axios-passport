import { AxiosInstance, AxiosRequestConfig } from "axios";
import { TokenUtils } from "./token";
export async function passportLogin(
    instance: AxiosInstance,
    username: string,
    password: string,
    config: AxiosRequestConfig
) {
    const axiosPassportConfig = instance.defaults['passortConfig']

    const response = await instance.post(`${axiosPassportConfig.passportUrl}`, {
        grant_type: "password",
        client_id: axiosPassportConfig.clientId,
        client_secret: axiosPassportConfig.clientSecret,
        username: username,
        password: password,
        scope: axiosPassportConfig.scope
    }, { skipRefreshToken: true, ...config })

    const { data } = response
    TokenUtils.setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expires: data.expires_in,
    })

    return response
}