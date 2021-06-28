
import axios, { AxiosInstance } from 'axios';
import { IAxiosPassportConfig, AxiosPassportInstance } from './types'
import { defaultAxiosPassportConfig } from './default-config';
import { TokenUtils } from './token'
import { injectPassportInterceptor } from './axios-passport-interceptor';
export function withPassport(instance: AxiosInstance, config: IAxiosPassportConfig): AxiosPassportInstance {

    // merge default config options
    const axiosPassportConfig: IAxiosPassportConfig = { ...defaultAxiosPassportConfig, ...config };


    instance.defaults['passortConfig'] = axiosPassportConfig
    injectPassportInterceptor(instance, axiosPassportConfig)

    return instance

}