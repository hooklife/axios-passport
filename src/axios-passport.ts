
import axios, { AxiosInstance } from 'axios';
import { IAxiosPassportConfig, AxiosPassportInstance } from './types'
import { defaultAxiosPassportConfig } from './default-config';
import { TokenUtils  } from './tokenUtils'
import { createLoginMethod } from './passport-login'
import { injectPassportInterceptor } from './axios-passport-interceptor';
export function withPassport(instance: AxiosInstance, config: IAxiosPassportConfig): AxiosPassportInstance {

    // merge default config options
    const axiosPassportConfig: IAxiosPassportConfig = { ...defaultAxiosPassportConfig, ...config };

    const tokenUtils = new TokenUtils()


    instance = createLoginMethod(instance as AxiosPassportInstance, axiosPassportConfig, tokenUtils)
    injectPassportInterceptor(instance, axiosPassportConfig, tokenUtils)


    return instance

}