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
                    <input name="username" v-model="user" type="text" class="form-control" placeholder="用户名" >
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback">
                    <input name="password" v-model="pw" type="password" class="form-control" placeholder="密码">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div class="row">
                    <div class="col-xs-8">
                    <div class="checkbox icheck">
                        <label>
                            <input type="checkbox"> 记住我
                        </label>
                    </div>
                    </div>
                    <!-- /.col -->
                    <div class="col-xs-4">
                    <button type="submit" class="btn btn-primary btn-block btn-flat" @click="login">登录</button>
                    </div>
                    <!-- /.col -->
                </div>
                
                <!-- <a href="#">忘记密码？</a><br>
                <a href="register.html" class="text-center">注册</a> -->

            </div>
        <!-- /.login-box-body -->
        </div>
    </div>
    
    
</template>

<script>
let config = {
    // baseURL: '/api/',
  timeout: 10000,
  withCredentials: true,
    // `headers`选项是需要被发送的自定义请求头信息
  headers: {
    // 'X-Requested-With': 'XMLHttpRequest',
    // 'Cookie': 'sessionId=' + sessionId 
  },
  // transformRequest: [function (data) {  
  //   // 需要序列化数据，数据放到formdata
  //   return qs.stringify(data)
  // }]
}
export default {
    name:'',
    components:{
       
    },
    data() {

      return {
        user:'',
        pw:''
      };
    },
    mounted(){
        
    },
    methods: {
        login(){
           this.$post({
              url: HP1+'/rbac/login',
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
                        this.$message({
                            showClose: true,
                            message: res.data.message,
                            type:'error'
                        });
                    }
               }
                
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
.wrapper{
    overflow: visible;
    height: 100%;
}
.login-page{
    height: 100%;
    position: relative;
    padding:7% 0 ;
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
    /* background: url("../../static/img/blue.png") no-repeat; */
    border: none;
    cursor: pointer;
}

</style>
