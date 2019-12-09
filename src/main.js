import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import { _local  } from './storage/storage';

import axios from 'axios';
import { refreshToken } from  './api/api'




Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})






/*是否有请求正在刷新token*/
window.isRefreshing = false
/*被挂起的请求数组*/
let refreshSubscribers = []

/*push所有请求到数组中*/
function subscribeTokenRefresh (cb) {
  refreshSubscribers.push(cb)
}

/*刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）*/
function onRrefreshed (token) {
  refreshSubscribers.map(cb => cb(token))
}

axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容 
  if(config.headers.meta && config.headers.meta.requiresAuth){
    let is_refresh = _local.get('is_refresh');
    console.log(is_refresh);
    if(!is_refresh){
      alert('刷新token过期，请重新登录')
      _local.remove('access_token');
        _local.remove('is_token');            
          window.location.href = '#/login'
          return
    }

    let token = _local.get('access_token')
    if (token) {      
        config.headers.Authorization = 'Bearer '+ `${token}`;
    }else {
      alert('刷新token过期，请重新登录')
      _local.remove('access_token');
        _local.remove('is_token');            
          window.location.href = '#/login'
          return
    }

    let is_token = _local.get('is_token') //有值，token还在有效期，没值则需要刷新token
    if(!is_token && config.url.indexOf('authorizations/current') === -1){ //需要刷新
      /*判断是否正在刷新*/
          if (!window.isRefreshing) {
            /*将刷新token的标志置为true*/
              window.isRefreshing = true
              /*发起刷新token的请求*/
              refreshToken({_method: 'PUT'}).then(data => {
                /*将标志置为false*/
                window.isRefreshing = false              
                /*执行数组里的函数,重新发起被挂起的请求*/
                onRrefreshed(data.access_token)
                /*执行onRefreshed函数后清空数组中保存的请求*/
                refreshSubscribers = []
              }).catch(err => {
                console.log(err);
                /*清除本地保存的auth*/
                // localStorage.removeItem('auth')
                window.location.href = '#/login'
              })
      }
      /*把请求(token)=>{....}都push到一个数组中*/
          let retry = new Promise((resolve, reject) => {
           /*(token) => {...}这个函数就是回调函数*/
            subscribeTokenRefresh((token) => {
                config.headers.Authorization = 'Bearer ' + token
                /*将请求挂起*/
                console.log('挂起');
                console.log(config);
                resolve(config)
            })
        })
          return retry
    }
    
      }

    console.log('通过');  
  
  return config;   
    
}, function (err) {
    return Promise.reject(err);
})


//拦截器
axios.interceptors.response.use(
  response => {   
    if(!response.data['code']){
        response.data['code'] = 200;  //200正确，其余情况就对的
      }
        
      return new Promise((resolve, reject) => {
        resolve(response);
      });   
  },
  error => {    
      if (error.response) {         
        switch (error.response.status) {
          case 401:
            console.log(401);
            window.location.href = '#/login'
          default:
            if(!error.response.data['code']){       
              error.response.data['code'] = 500;  //500出错，其余情况就对的
          }

          return new Promise((resolve, reject) => {
            resolve(error.response);
                
          });           

        }         
      
    }
    return new Promise((resolve, reject) => {
      reject(error);            
    });

  }
);
/*router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  console.log(to)
  if (to.meta.requiresAuth ) {
    let is_token = _local.get('is_token');
    if(!is_token){
      next({ path: '/login' })     
    }else {
      next()  
    }
    
  } else {    
    next()
  }
})*/

//router.afterEach(transition => {
//NProgress.done();
//});

const vue = new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')



