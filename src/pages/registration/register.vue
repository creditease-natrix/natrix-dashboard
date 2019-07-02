<template>
    <div class='hold-transition login-page'>
        <div class="login-box">
            <div class="login-logo">
                <a href=""><b>Natrix</b></a>
            </div>
            <div class="login-box-body">
                <p class="login-box-msg">Natrix账号注册</p>

                
                <div class="form-group has-feedback">
                    <input name="username" v-model="user" type="text" class="form-control" placeholder="电子邮箱" >
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback">
                    <input name="password" v-model="pw" type="password" class="form-control" placeholder="密码">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback">
                    <input name="password" v-model="confirmPw" type="password" class="form-control" placeholder="确认密码">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div class="row">
                    <el-button type="info" size="mini" @click="register">立即注册</el-button>
                </div>
                
              

            </div>
        </div>
    </div>
    
    
</template>

<script>

export default {
    name:'',
    components:{
       
    },
    data() {

      return {
        user:'',
        pw:'',
        confirmPw:''
      };
    },
    mounted(){
        
    },
    methods: {
        register(){
            let pwreg = /^[\w]{6,16}$/
            let emailreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if(!emailreg.test(this.user)){
                this.$message({
                    type:"error",
                    message:"您输入的邮箱格式不正确，请重新输入"
                })
                return
            }
            else if(!pwreg.test(this.pw)){
                this.$message({
                    type:"error",
                    message:"您输入的密码格式不正确，请重新输入"
                })
                return
            }
            else if(this.pw !== this.confirmPw){
                this.$message({
                    type:"error",
                    message:"您两次输入的密码不一致"
                })
                return
            }else{
                this.registerHandle()
            }
        },
        registerHandle(){
            this.$post({
                url:HP1+"/rbac/user/register/v1",
                data:{
                    username:this.user,
                    password:this.pw,
                    verify_password:this.confirmPw
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.$message({
                        type:"success",
                        message:"注册成功！"
                    })
                    setTimeout(_=>{
                        window.location.href=NatrixIndex
                    },1000)
                }else{
                    this.$message({
                        type:"error",
                        message:res.data.message
                    })
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
.row{
    text-align:right;
}
.row .el-button{
    margin-right:15px;
}
</style>
