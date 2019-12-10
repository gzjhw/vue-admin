<template>
  <el-form class="registe-form" status-icon :rules="registeRules" ref="registeForm" :model="registeForm" >
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="registeForm.phone" ></el-input>
    </el-form-item>
    <el-form-item label="用户昵称" prop="name">
      <el-input v-model="registeForm.name"></el-input>
    </el-form-item>
    <el-form-item label="用户密码" prop="password">
      <br/>
      <el-col :span="20">
        <el-input :type="passwordType" v-model="registeForm.password"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click.prevent="showPassword()">显示密码</el-button>     
      </el-col>
    </el-form-item>
    <el-form-item v-if = isCode label="请输入验证码" prop="verifycode" >      
      <el-input v-model="registeForm.verification_code" ></el-input>      
    </el-form-item>
    <div v-if = isCode class ="code" ><img v-bind:src="imgUrl" /><el-button @click.prevent="refreshCode()">看不清，换一张</el-button></div>     
    <el-form-item>
      <el-button type="primary" size="small" @click="submitForm('registeRules')" class="login-submit">注&nbsp;&nbsp;&nbsp;&nbsp;册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { requestVerifycode, requestRegister} from '../api/api';
export default {  
  data() {
  const checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          var reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/;
          console.log(reg.test(value));
          if (reg.test(value)) {
            if(!this.isCode){
                requestVerifycode({'phone':value}).then(res =>{
                var data = res.data; 
                if (res.status >= 400) {
                  this.$message({
                    message: data.message,
                    type: 'error'
                  });
                } else {
                    this.isCode = true;
                    this.verifykey = data.captcha_key                  
                    this.imgUrl = data.captcha_image_content;
                    console.log(data);
                    callback();  
                }
              });
            }else{
              callback();
            }         
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };

    // 用户名自定义验证规则
    const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入正确的用户名'))
        } else {          
          callback()
        }
    }
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          callback()
        }
    }
    return {       
        registeForm: {
            phone: '',
            name: '',
            password: '',          
            verification_code: ''
        },
        checked: false,

        identifyCodes: '1234567890',
        identifyCode: '',
        registeRules: { // 绑定在form表单中的验证规则
            phone: [
              {required: true, trigger: 'blur', validator: checkPhone }
            ],


            name: [
                { required: true, trigger: 'blur', validator: validateUsername }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
            ],
            verifycode: [
                { required: true, trigger: 'blur', validator: validateVerifycode }
            ]
        },
        
        passwordType: 'password',
        //图片显示
        isCode:false,       
        verifykey:'',
        imgUrl: '#',
      }
  },

    created() {

    },
    mounted() {
        // 验证码初始化
        this.identifyCode = ''
        //this.makeCode(this.identifyCodes, 4)
    },
    computed: {
    },
    props: [],
    methods: {
        // 通过改变input的type使密码可见
        showPassword() {
            this.fontstyle === '' ? (this.fontstyle = 'color: red') : (this.fontstyle = '') // 改变密码可见按钮颜色
            this.passwordType === '' ? (this.passwordType = 'password'): (this.passwordType = '')
        },
        
        //点击登入按钮
        submitForm() {
            this.$refs.registeForm.validate(valid => {
              if (valid) {
                  var parms = {
                      'name': this.registeForm.name,
                      'password': this.registeForm.password,
                      'verification_key': this.verifykey,
                      'verification_code': this.registeForm.verification_code,
                    }
                  requestRegister(parms).then(res =>{                                             
                      var data = res.data;                           
                      if (code !== 200) {
                        this.$message({
                          message: data.message,
                          type: 'error'
                        });
                      } else {
                         this.$router.push({ path: '/' });                                           
                      }
                    });             
              }else {
                  console.log('error submit!!');
                  return false;
              }
            })
        },

        // 切换验证码
        refreshCode() {
            requestVerifycode({'phone':this.registeForm.phone}).then(res =>{ 
              var data = res.data;              
              if (res.status > 400) {
                this.$message({
                  message: data.message,
                  type: 'error'
                });
              } else {
                  this.isCode = true;
                  this.verifykey = data.captcha_key;
                  this.imgUrl = data.captcha_image_content;                  
                  
              }
            });             
        },

    }
}
</script>
<style scoped>
    .registe-form{
      width:500px;
      margin:auto;
    }
    .code {
      display:flex; 
    }
    
    
</style>