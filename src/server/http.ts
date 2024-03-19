import { merge } from 'lodash-es'
import { isFunction } from '@vue/shared'
import { RequestErrMsgEnum, RequestMethodsEnum } from '@/enums/requestEnums'
import requestCancel from './cancel'

export default class HttpRequest {
    private readonly options
    constructor(options) {
        this.options = options
    }
    /**
     * @description 重新请求
     */
    retryRequest(options, config) {
        const { retryCount, retryTimeout } = config
        if (!retryCount || options.method?.toUpperCase() == RequestMethodsEnum.POST) {
            return Promise.reject()
        }
        uni.showLoading({ title: '加载中...' })
        config.hasRetryCount = config.hasRetryCount ?? 0
        if (config.hasRetryCount >= retryCount) {
            return Promise.reject()
        }
        config.hasRetryCount++
        config.requestHooks.requestInterceptorsHook = (options) => options
        return new Promise((resolve) => setTimeout(resolve, retryTimeout))
            .then(() => this.request(options, config))
            .finally(() => uni.hideLoading())
    }
    /**
     * @description get请求
     */
    get<T = any>(options: any, config?: Partial<any>): Promise<T> {
        return this.request({ ...options, method: RequestMethodsEnum.GET }, config)
    }

    /**
     * @description post请求
     */
    post<T = any>(options: any, config?: Partial<any>): Promise<T> {
        return this.request({ ...options, method: RequestMethodsEnum.POST }, config)
    }

    /**
     * @description put
     */
    put<T = any>(options: any, config?: Partial<any>): Promise<T> {
        return this.request({ ...options, method: RequestMethodsEnum.PUT }, config)
    }

    /**
     * @description delete
     */
    delete<T = any>(options: any, config?: Partial<any>): Promise<T> {
        return this.request({ ...options, method: RequestMethodsEnum.DELETE }, config)
    }
    /**
     * @description 上传图片
     */
    uploadFile(options: any, config?: Partial<any>) {
        let mergeOptions: any = merge({}, this.options.requestOptions, options)
        const mergeConfig: any = merge({}, this.options, config)
        const { requestInterceptorsHook, responseInterceptorsHook, responseInterceptorsCatchHook } =
            mergeConfig.requestHooks || {}
        if (requestInterceptorsHook && isFunction(requestInterceptorsHook)) {
            mergeOptions = requestInterceptorsHook(mergeOptions, mergeConfig)
        }
        return new Promise((resolve, reject) => {
            uni.uploadFile({
                ...mergeOptions,
                success: async (response) => {
                    if (response.statusCode == 200) {
                        response.data = JSON.parse(response.data)
                        if (responseInterceptorsHook && isFunction(responseInterceptorsHook)) {
                            try {
                                response = await responseInterceptorsHook(response, mergeConfig)
                                resolve(response)
                            } catch (error) {
                                reject(error)
                            }
                            return
                        }
                        resolve(response)
                    }
                },
                fail: async (err) => {
                    if (
                        responseInterceptorsCatchHook &&
                        isFunction(responseInterceptorsCatchHook)
                    ) {
                        reject(await responseInterceptorsCatchHook(mergeOptions, err))
                        return
                    }
                    reject(err)
                }
            })
        })
    }
    /**
     * @description 请求函数
     */
    async request(options: any, config?: Partial<any>): Promise<any> {
        let mergeOptions: any = merge({}, this.options.requestOptions, options)
        const mergeConfig: any = merge({}, this.options, config)
        const { requestInterceptorsHook, responseInterceptorsHook, responseInterceptorsCatchHook } =
            mergeConfig.requestHooks || {}
        if (requestInterceptorsHook && isFunction(requestInterceptorsHook)) {
            mergeOptions = requestInterceptorsHook(mergeOptions, mergeConfig)
        }
        return new Promise((resolve, reject) => {
            const requestTask = uni.request({
                ...mergeOptions,
                async success(response) {
                    if (responseInterceptorsHook && isFunction(responseInterceptorsHook)) {
                        try {
                            response = await responseInterceptorsHook(response, mergeConfig)
                            resolve(response)
                        } catch (error) {
                            reject(error)
                        }
                        return
                    }
                    resolve(response)
                },
                fail: async (err) => {
                    if (err.errMsg == RequestErrMsgEnum.TIMEOUT) {
                        this.retryRequest(mergeOptions, mergeConfig)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err))
                        return
                    }

                    if (
                        responseInterceptorsCatchHook &&
                        isFunction(responseInterceptorsCatchHook)
                    ) {
                        reject(await responseInterceptorsCatchHook(mergeOptions, err))
                        return
                    }
                    reject(err)
                },
                complete(err) {
                    if (err.errMsg !== RequestErrMsgEnum.ABORT) {
                        requestCancel.remove(options.url)
                    }
                }
            })
            const { ignoreCancel } = mergeConfig
            !ignoreCancel && requestCancel.add(options.url, requestTask)
        })
    }
}
