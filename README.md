# axios-passport
# 快速开始
引入 npm 包
```shell
npm i axios-passport
```
绑定axios example
```js
import axios from 'axios'
import { withPassport } from 'axios-passport'
import { ElMessage } from 'element-plus'

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 120000,
})


instance.interceptors.response.use(response => response, error => {
    if (error?.config?.skipResponseInterceptor) {
        return Promise.reject(error);
    }
    if (error.response.status === 401) {
        ElMessage({
            message: '认证失败，即将跳转到登录页！',
            type: 'error',
            duration: 3000,
            showClose: true
        })
        setTimeout(() => {
            location.reload() // 修复401后，前进后退失效问题
        }, 3000)
        return Promise.reject(error)
    }
    if (error.response.status === 400) {
        ElMessage({
            message: error.response.data.message || '无法完成操作，请检查后重试！',
            type: 'error',
            duration: 3000,
            showClose: true
        })
        return Promise.reject(error)
    }
    if (error.response.status === 422) {
        ElMessage({
            message: error.response.data.message || '提交的内容出错，请修改后重试！',
            type: 'error',
            duration: 3000,
            showClose: true
        })
        return Promise.reject(error)
    }
    if (error.response.status === 500) {
        ElMessage({
            message: error.response.data.message || '很抱歉，操作发生错误，请重试！',
            type: 'error',
            duration: 3000,
            showClose: true
        })
        return Promise.reject(error)
    }
    if (error.response.status === 502 || error.response.status === 504) {
        ElMessage({
            message: '很抱歉，服务器异常，请稍后重试！',
            type: 'error',
            duration: 3000,
            showClose: true
        })
        return Promise.reject(error)
    }
    if (error.response.status === 403) {
        ElMessage({
            message: error.response.data.message || '很抱歉，系统拒绝了您的操作！',
            type: 'error',
            duration: 3000,
            showClose: true
        })
        return Promise.reject(error)
    }
    return Promise.reject(error)
})

const client = withPassport(instance, {
    clientId: import.meta.env.VITE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CLIENT_SECRET
})

export default client
```

