import axios from 'axios'
import md5 from 'js-md5';

//后端请求地址
const baseUrl = 'http://172.25.78.33:3000';

//axios实例配置
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
})

//请求拦截器
instance.interceptors.request.use(
    config => {
        //每次请求头上带上token
        if (getToken()) {
            config.headers.Authorization = `Bearer ${getToken()}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

//响应拦截器
instance.interceptors.response.use(res => {
    const code = res.data.status;
    //对错误码进行统一处理
    switch (code) {
        case 404:
            break;
        case 500:
            break;
        default:
            return res;
    }
}, error => {
    return Promise.reject(error);
})

//=========================================Http Util==========================================
//获取Token
export function getToken() {
    return window.sessionStorage.getItem('token');
}

//获取用户名
export function getUserName() {
    return window.sessionStorage.getItem('name');
}

//设置用户名和Token
export function setLoginedUser(username, token) {
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('token', token);
}

//清楚用户名和Token
export function logoutUser() {
    window.sessionStorage.removeItem('name');
    window.sessionStorage.removeItem('token');
}

//==========================================HTTP==========================================
//Get请求
export function getDemo() {
    return instance({
        url: "/admin/get",
        method: "GET",
        params: {
        }
    });
}
//Post请求
export function login(username, password) {
    return instance({
        url: '/user/login',
        method: 'POST',
        data: {
            username: username,
            password: md5(password)
        }
    })
}


//上传文件
export function upload(file, filename) {
    let formData = new FormData();
    formData.append("filename", filename);
    formData.append("file", file);
    return axios.create({
        baseURL: baseUrl,
        timeout: 5000,
        headers: { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'multipart/form-data' },
    })({
        url: '/upload',
        method: "POST",
        data: formData
    })
}

export default instance

