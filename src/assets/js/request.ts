import axios from 'axios'
import { ElMessage } from 'element-plus'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
const router = useRouter()

const store = userStore()

let service = axios.create({
  baseURL: 'http://127.0.0.1:8299/', // 固定api
  timeout: 80000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config: any) => {
    config.headers.authorization = store.userInfo.token || ''
    return config
  },
  (error) => {
    // Do something with request error
    console.log('出错啦', error) // for debug
    throw new Error()
  }
)

// response interceptor
service.interceptors.response.use(
  (response : any) => {
    // token验证失败跳到登录页
    if (response.data && !response.data.status && response.data.code === 401) {
      ElMessage({
        showClose: true,
        message: response.data.msg,
        type: 'error'
      })
      window.location.href = '/'
      throw new Error()
    } else if (response.data.code === 400 || response.data.code === 404) {
      ElMessage({
        showClose: true,
        message: response.data.msg,
        type: 'error'
      })
      throw new Error()
    } else if (response.data.code === 500) {
      ElMessage({
        showClose: true,
        message: response.data.msg,
        type: 'error'
      })
      throw new Error()
    }
    return response.data
  },
  (error) => {
    console.log('err' + error) // for debug
    if (error.response.status === 403) {
      ElMessage.error('错了')
    } else {
      ElMessage.error('服务器请求错误，请稍后再试')
    }
    throw new Error()
  }
)

export default service
