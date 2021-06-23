
import axios, { AxiosInstance, AxiosStatic } from 'axios';
import { IAxiosPassportConfig, AxiosPassportInstance } from './types'
import { defaultAxiosPassportConfig } from './default-config';
import { TokenUtils, ITokens } from './tokenUtils'
import { createLoginMethod } from './passport-login'
import { injectPassportInterceptor } from './axios-passport-interceptor';
export function withPassport(instance: AxiosInstance, config: IAxiosPassportConfig): AxiosInstance | AxiosPassportInstance {

    // merge default config options
    const axiosPassportConfig: IAxiosPassportConfig = { ...defaultAxiosPassportConfig, ...config };

    const tokenUtils = new TokenUtils()


    instance = createLoginMethod(instance as AxiosPassportInstance, config, tokenUtils)
    injectPassportInterceptor(instance, config, tokenUtils)


    return instance

}