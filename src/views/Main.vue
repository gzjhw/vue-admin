<template>
	 <div>
	 	<section>
	 		<div v-if="user" class="main_top">
	 			<font color="#1D57BB" class="login-user">欢迎您，12262163 (12262163)</font>
	 			<a @click="logout" target="_self">退出</a>
	 		</div>
	 		<div v-if="!user" class="main_top">
	 			<span class="STYLE1">欢迎光临！</span>
	 			<a @click="login">登录</a>				
	 		</div>			
			
		</section>
	
		 <footer>  		
	  		<p>Copyright © 1998 - 2019 Tencent. All Rights Reserved <br>
	     	腾讯公司 <a class="clink" target="_blank" href="http://www.tencent.com/zh-cn/le/copyrightstatement.shtml">版权所有</a> <a class="clink" target="_blank" href="http://www.qq.com/contract.shtml">服务条款</a>
			</p>
		</footer>
	</div>
</template>

<script>
	export default {
		name:'main',
		inject:['reload'],
		data() {
			return {
				user:null,
			}
		},

		methods: {			
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/');
					_this.reload(); //刷新问题  
				}).catch(() => {

				});


			},
			//跳转到登录
			login:function(){
				var _this = this;
				sessionStorage.removeItem('user');
				_this.$router.push('/login');
			},
			
		},

		mounted() {
			this.user = sessionStorage.getItem('user');			
			if (this.user) {
				this.user = JSON.parse(user);				
			}

		}


	}

</script>

<style scoped>
	.main_top a{
		color:#1D57BB; text-decoration:none; cursor:pointer;
		
	}

	.main_top a:hover {
		text-decoration:underline; 
	}
	
</style>