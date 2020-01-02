import axios from 'axios';
import { _local   } from '../storage/storage';


let ttl = 59;

let JWT_REFRESH_TTL = 20150;  //可以允许刷新时间

let base = '';

let base1 = '/api/v1';



/*export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => {
	return res.data 
} ).catch(err=>{
	console.log(err)
})};*/
export const refreshToken = params => { return axios.post(`${base1}/authorizations/current`, params,  {headers: {meta: { requiresAuth: true }}} ).then(res=>{
	let { access_token, token_type, expires_in } = res.data;    
    _local.set('access_token',access_token);
    _local.set('is_token',true, 60000*ttl); //    
	return res;
})};





/*export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
*/


export const getMwsConfigListPage = params => { return axios.get(`${base1}/mwsConfig`, {params: params, headers: {meta:{ requiresAuth: true }} } ).then(res=>{
	return res
}); };



export const batchRemoveMwsConfig = params => { 
	params['_method'] = 'delete';
	return axios.post(`${base1}/mwsConfig`, params, {headers: {meta:{ requiresAuth: true }} 
}).then(res=>{
	return res
}); };

export const editMwsConfig = params => { 
	params['_method'] = 'put';
	return axios.post(`${base1}/mwsConfig/${params['id']}`, params, {headers: {meta:{ requiresAuth: true }} 
}).then(res=>{
	return res
}); };


export const removeMwsConfig = params => { 
	params['_method'] = 'delete';
	return axios.post(`${base1}/mwsConfig/${params['id']}`, params, {headers: {meta:{ requiresAuth: true }} 
}).then(res=>{
	return res
}); };

export const addMwsConfig = params => { return axios.post(`${base1}/mwsConfig`, params,  {headers: {meta: { requiresAuth: true }}} ).then(res=>{	
	return res
}); };



//亚马逊时库映射
export const getAmzProductMapsListPage = params => { return axios.get(`${base1}/amzProductMap`, {params: params, headers: {meta:{ requiresAuth: true }} } ).then(res=>{
	return res
}); };



export const batchRemoveAmzProductMaps = params => { 
	params['_method'] = 'delete';
	return axios.post(`${base1}/amzProductMap`, params, {headers: {meta:{ requiresAuth: true }} 
}).then(res=>{
	return res
}); };

export const editAmzProductMaps = params => { 
	params['_method'] = 'put';
	return axios.post(`${base1}/amzProductMap/${params['id']}`, params, {headers: {meta:{ requiresAuth: true }} 
}).then(res=>{
	return res
}); };


export const removeAmzProductMaps = params => { 
	params['_method'] = 'delete';
	return axios.post(`${base1}/amzProductMap/${params['id']}`, params, {headers: {meta:{ requiresAuth: true }} 
}).then(res=>{
	return res
}); };

export const addAmzProductMaps = params => { return axios.post(`${base1}/amzProductMap`, params,  {headers: {meta: { requiresAuth: true }}} ).then(res=>{	
	return res
}); };

export const importAmzProductMaps = params => { return axios.post(`${base1}/amzProductMap/import`, params,  {headers: {meta: { requiresAuth: true }, 'Content-Type': 'multipart/form-data' }} ).then(res=>{	
	return res
}); };


export const requestUser = params => { return axios.get(`${base1}/user`,  {params: params, headers: {meta: { requiresAuth: true }} }).then(res=>{
	return res
}); };

export const requestLogin = params => { return axios.post(`${base1}/authorizations`, params).then(res => {
	let { access_token, token_type, expires_in } = res.data;
	let is_refresh = true; 	
	_local.set('is_refresh',is_refresh, 60000*JWT_REFRESH_TTL);
    _local.set('access_token',access_token);
    _local.set('is_token',true, 60000*ttl); //
	return res 
}); };

//取图片验证码
export const requestVerifycode = params => { return axios.post(`${base1}/captchas`, params).then(res => {	
	return res 
}); };

//注册功能
export const requestRegister = params => { return axios.post(`${base1}/users`, params).then(res => {	
	return res 
}); };

//sku 转化



