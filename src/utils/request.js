import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
import {showRequestErrorInfo} from '@/utils/lib'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})
const successStatus = [200, 201, 204] //请求成功返回的httpstatus

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const httpStatus = response.status
    let res = response.data
    // if the custom code is not 20000, it is judged as an error.
    //if (res.code !== 200) {
    //使用http status
    if (!successStatus.includes(httpStatus)) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      //if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      if (httpStatus === 400) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug

    // let errorMessage = ''
    // const apiName = error.response.config.url.replace(error.response.config.baseURL, '')
    // if (apiName.toLowerCase() === '/login/') //处理的登录返回的错误信息
    // {
    //   errorMessage = ''
    //   error.response.data.non_field_errors.forEach(item => {
    //     errorMessage += item + '</br>'
    //   })
    // }
    // else{
    //   errorMessage = error.response.data.message
    // }
    // Message({
    //   dangerouslyUseHTMLString: true,
    //   message: errorMessage,//error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    
    let errorMessage =error.response.data.message
    let errorData= error.response.data
    let errorStatus=error.response.status
    if(errorStatus===400) {
    errorMessage=showRequestErrorInfo(errorData)
  }
    if (errorMessage == 'Input error') {
      errorMessage =errorData.data
    }
    Message({
      dangerouslyUseHTMLString: true,
      message: errorMessage, //error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })

    return Promise.reject(error)
  }
)

export default service
