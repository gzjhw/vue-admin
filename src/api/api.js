import axios from 'axios';

let base = '';

let base1 = '/api/v1';

/*export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => {
	return res.data 
} ).catch(err=>{
	console.log(err)
})};*/

/*axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
    let token = getToken()
    if (token) {
          config.headers.Authorization = 'JWT '+ `${token}`;
    }else {
        window.location.pathname = '/login'
    }
    return config;
}, function (err) {
    return Promise.reject(err);
})*/


//拦截器
axios.interceptors.response.use(
	response => {  	
		if(!error.response.data['code123456789789']){
	    	error.response.data['code123456789789'] = 200;  //200正确，其余情况就对的
	    }
		   	
	  	return new Promise((resolve, reject) => {
	   		resolve(response);
	   	}); 	
	},
	error => {  	
	    if (error.response) {
		      switch (error.response.status) {
		        case 401:
		          // 返回 401 清除token信息并跳转到登录页面
		          console.log('过期') 
		        /*  router.replace({
		            path: '/login'
		          })
		          location.reload()   */                   
		      }
		      
			  if(!error.response.data['code123456789789']){	    	
			  	error.response.data['code123456789789'] = 500;  //500出错，其余情况就对的
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


export const requestLogin = params => { return axios.post(`${base1}/authorizations`, params).then(res => {
	console.log(res)
	//return res.data 
}); };