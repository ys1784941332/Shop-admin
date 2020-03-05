import axios from 'axios';

// 导入 Nprogress 包和样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
  
  axios.interceptors.request.use(config=>{

    NProgress.start()       // 当进入request拦截器，表示发送了请求，我们就开启进度条
    //为请求头对象，添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
  })
  
  //在response拦截器中，隐藏进度条
  axios.interceptors.response.use(config =>{

    NProgress.done()        //当进入response拦截器，表示请求已经结束，我们就结束进度条
    return config
  })
  // 添加实例方法
  Vue.prototype.$http = axios             // 将 不是 Vue 插件的库 改为 Vue.use()注册使用
}

export default MyHttpServer