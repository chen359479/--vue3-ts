import {  AxiosRequestConfig } from 'axios'
declare module "axios" {
    interface AxiosResponse<T = any> {
        error: number;
        msg: string;
        code: number
        data: string|number|Array<any>|object,
        total: number
    }
    export function create(config?: AxiosRequestConfig): AxiosInstance;
}
