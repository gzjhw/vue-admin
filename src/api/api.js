import axios from 'axios';
import { _local   } from '../storage/storage';

import {vue} from '../main';


let base = '';

let base1 = '/api/v1';

/*export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => {
	return res.data 
} ).catch(err=>{
	console.log(err)
})};*/
const refreshToken = params => { return axios.post(`${base1}/authorizations/current`, params).then(res=>{
	let { access_token, token_type, expires_in } = data;
    var expires = expires_in * 1000; 
    _local.set('access_token',access_token, expires);
    _local.set('old_token',access_token);	
	return res.data
})};

axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容	
	var url = config.url;	
	if(url !== '/api/v1/authorizations' && url !== '/api/v1/authorizations/current'){//不是login，不是刷新		
		let token = _local.get('access_token')
		let old_token = _local.get('access_token')
		if (token) {		 	
		    config.headers.Authorization = 'Bearer '+ `${token}`;
		}
	}

	if(url == '/api/v1/authorizations/current'){//刷新token
		let old_token = _local.get('old_token')
		if (old_token) {		 	
		    config.headers.Authorization = 'Bearer '+ `${old_token}`;
		}
	}

	
	console.log(config);
	
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
			    // 返回401清除token信息并跳转到登录页面				
				var originalRequest = error.config;
				var url = originalRequest.url;
				console.log(originalRequest);
				console.log(url);				
				if(url !== '/api/v1/authorizations' && url !== '/api/v1/authorizations/current'){ //不是登录，不是刷新					
					var params = {}
					refreshToken(params).then(data=>{ //刷新token，成功重新发请求						
						if(data.code == 200){
							return axios.request(originalRequest);	
						}						
						
					}).catch(err=>{						
						vue.$router.push({ path: '/login' });  //跳转到
					});	
					
				}

		    }
		      
			if(!error.response.data['code']){	    	
			  	error.response.data['code'] = 500;  //500出错，其余情况就对的
			}

			return new Promise((resolve, reject) => {
				resolve(error.response);
			      
			});
		}
		return new Promise((resolve, reject) => {
			reject(error.response);			      
		});

	}
);



export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const requestUser = params => { return axios.get(`${base1}/user`, params).then(res=>{
	return res.data
}) };



export const requestLogin = params => { return axios.post(`${base1}/authorizations`, params).then(res => {
	let { access_token, token_type, expires_in } = res.data;
    var expires = expires_in * 1000; 
    _local.set('access_token',access_token, expires);
    _local.set('old_token',access_token);	
	return res.data 
}); };