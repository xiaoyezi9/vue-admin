import axios from "axios";
//引入进度条
import nProgress from "nprogress";
//引入进度条的样式
import "nprogress/nprogress.css";
const requests=axios.create({
    baseURL:'https://lianghj.top:8888/api/private/v1',
    timeout:5000
})
//请求拦截器
requests.interceptors.request.use((config) => {
nProgress.start(); //进度条开始
 //config配置对象 ---包含请求体，url，data等等
config.headers.Authorization=sessionStorage.getItem('token')
    return config
})
//响应拦截器
requests.interceptors.response.use((res) => {
    nProgress.done(); //进度条结束
    return res.data
},(error) => {
    return Promise.reject(new Error('error'))
})
export default requests