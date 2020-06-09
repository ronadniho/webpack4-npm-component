import axios from 'axios'
// import Cookies from 'js-cookie'
import {Message} from 'element-ui'
import { Loading } from 'element-ui'
// create an axios instance
var baseURL;
if (process.env.NODE_ENV != 'production') {
  baseURL = '/ts/outer/api';
}
else {
  baseURL = '/outer/api'
}
const service = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 60000,// request timeout
})
let loadingObject
let requestNum = 0

service.interceptors.request.use(
  request => {
    loadingObject = Loading.service()
    requestNum++
    return request
  },
  error => {
    // if (loadingObject && loadingObject.close) {
    //   loadingObject.close()
    // }
    requestNum--
    if (loadingObject && loadingObject.close && requestNum === 0) {
      loadingObject.close()
    }
    const app = window.app
    let user = window.sessionStorage.getItem('user');
    let status = parseInt(error.response && error.response.status)
    let message = null
    if (error.response) {
      message = status === 401 ? 'The current session is invalid. Please login again!' : (error.response.data && error.response.data.message) || 'The server has an exception. Please try again'
    } else if (error.request) {
      message = 'Communication exception, please try again'
    } else {
      message = error.message
    }
    if(document.getElementsByClassName('el-message').length === 0){
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // if (loadingObject && loadingObject.close) {
    //   loadingObject.close()
    // }
    requestNum--
    if (loadingObject && loadingObject.close && requestNum === 0) {
      loadingObject.close()
    }
    if (!response.data) {
      if(document.getElementsByClassName('el-message').length === 0){
        Message({
          message: (response.data && response.data.message) || 'Net error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else if (response.data.code === 401) {
      // if(document.querySelectorAll('.el-message--error').length ){
      //   document.getElementsByTagName('div')[document.getElementsByTagName('div').length-1].style.display='none'
      // }
     
      if(document.getElementsByClassName('el-message').length === 0){
        Message({
          message: response.data.message,
          type: 'error',
          duration: 5 * 1000
        })  
      }
      loadingObject && loadingObject.close && loadingObject.close()
    } else if (response.data.code !== 200 || !response.data.success) {
      if(document.getElementsByClassName('el-message').length === 0){
        Message({
          message: response.data.message,
          type: 'error',
          duration: 5 * 1000
        })  
      }
    }
    return response
  },
  error => {
    requestNum--
    if (loadingObject && loadingObject.close && requestNum === 0) {
      loadingObject.close()
    }
    const app = window.app
    let user = window.sessionStorage.getItem('user');
    let status = parseInt(error.response && error.response.status)
    let message = null
    if (error.response) {
      message = status === 401 ? 'The current session is invalid. Please login again!' : (error.response.data && error.response.data.message) || 'The server has an exception. Please try again'
    } else if (error.request) {
      message = 'Communication exception, please try again'
    } else {
      message = error.message
    }
    // if(document.querySelectorAll('.el-message--error').length  ){
    //   try{
    //     document.body.removeChild(document.querySelectorAll('.el-message--error'))
    //   }catch(err){

    //   }
    //   // document.getElementsByTagName('div')[document.getElementsByTagName('div').length-1].style.display='none'
    // }
    if(document.getElementsByClassName('el-message').length === 0){
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    
    return Promise.reject(error)
  }
)
export default service
