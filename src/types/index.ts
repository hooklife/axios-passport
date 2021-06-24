import { AxiosInstance, AxiosRequestConfig } from 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        // if your cacheFlag was setting to 'useCache'
        skipRefreshToken?: boolean;
    }
}

export interface IAxiosPassportConfig {
    passportUrl?: string
    clientId: string
    clientSecret: string
    scope?: string
}
export interface AxiosPassportInstance extends AxiosInstance {
    login?(username:string,password:string,config?:AxiosRequestConfig):Promise<any>  
}

export interface IRefreshTokenResponse {
    access_token: string,
    refresh_token: string,
    expires_in: number
}