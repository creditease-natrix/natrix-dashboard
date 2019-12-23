<template>
    <div class='hold-transition login-page'>
        <div class="login-box">
            <div class="login-logo">
                <a href=""><b>Natrix</b></a>
            </div>
            <!-- /.login-logo -->
            <div class="login-box-body">
                <p class="login-box-msg">登入系统</p>

                
                <div class="form-group has-feedback">
                    <!-- <input name="username" v-model="user" type="text" class="form-control" placeholder="用户名" > -->
                    <el-input placeholder="用户名" v-model="user" clearable size="mini"></el-input>
                    <!-- <span class="glyphicon glyphicon-envelope form-control-feedback"></span> -->
                </div>
                <div class="form-group has-feedback">
                    <!-- <input name="password" v-model="pw" type="password" class="form-control" placeholder="密码"> -->
                    <el-input placeholder="请输入密码" type="password" v-model="pw"   show-password size="mini"></el-input>
                    <!-- <i slot="suffix" title="显示密码" style="cursor:pointer;" class="icon iconfont icon-xianshi1"></i>
                    <i slot="suffix" title="隐藏密码" style="cursor:pointer;" class="icon iconfont icon-yincang1"></i> -->
                </div>
                <div class="row">
                    <div class="col-xs-6">
                        <div class="checkbox icheck">
                            <label>
                                <input type="checkbox"> <span class="remind">记住我</span>
                            </label>
                        </div>
                    </div>
                    <!-- /.col -->
                    <div class="col-xs-6 btnBox">
                        <el-button type="info" size="mini" @click="gotoRegister">注册</el-button>
                        <el-button type="primary" size="mini" @click="login">登录</el-button>
                    </div>
                </div>
                
               

            </div>
        </div>
    </div>
    
    
</template>

<script>
let config = {
  timeout: 10000,
  withCredentials: true,
  headers: {
   
  },
}
export default {
    name:'',
    components:{
       
    },
    data() {

      return {
        user:'',
        pw:'',
        input:""
      };
    },
    mounted(){
        
    },
    methods: {
        login(){
           this.$post({
              url: HP1+'/rbac/login/v1',
              data:{
                  username:this.user,
                  password:this.pw
              },
              config
            
            }).then(res=>{
               if(res.permission){
                   if(res.data.code  == 200){
                       window.localStorage.setItem("user",res.data.username)
                        this.$message({
                            showClose: true,
                            message: '恭喜您，登录成功！',
                            type:'success',
                            center: true
                        });
                        window.location.href=NatrixIndex
                        
                    }else{
                        messageTip("error",this.$t(res.data.message))
                    }
               }
                
            }) 
        },
        gotoRegister(){
            this.$router.push({
                path:"register"
            })
        }

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body,html{
    height: 100%;
}

.login-page{
    height: 100%;
    position: relative;
    padding:7% 0 ;
}
.checkbox input{
    margin-left:0 !important;
}
.checkbox .remind{
    margin-left:15px;
}
</style>
<style scoped>

.login-box{
    margin:0 auto;

} 
.icheckbox_square-blue, .iradio_square-blue {
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    padding: 0;
    width: 22px;
    height: 22px;
    border: none;
    cursor: pointer;
}
.checkbox{
    margin-top:0;
}
.btnBox{
    text-align:right;
}
</style>
