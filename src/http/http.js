import axios from 'axios'
import { Message, Loading } from 'element-ui'
const ConfigBaseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
let loadingInstance = null

export const Service = axios.create({
  timeout: 7000,
  baseURL: ConfigBaseURL,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

Service.interceptors.request.use(config => {
  loadingInstance = Loading.service({
    lock: true,
    text: 'loading...'
  })
  return config
})

Service.interceptors.response.use(response => {
  loadingInstance.close()
  return response.data
}, error => {
  console.log('TCL: error', error)
  const msg = error.Message !== undefined ? error.Message : ''
  Message({
    message: '网络错误' + msg,
    type: 'error',
    duration: 3 * 1000
  })
  loadingInstance.close()
  return Promise.reject(error)
})
