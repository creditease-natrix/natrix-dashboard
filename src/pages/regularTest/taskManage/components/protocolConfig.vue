<template>
    <div class="agreement">
        <div v-show="active == 'PING' " class="protocolFilter">
            <div class="agreementContent">
                <ul class="pingAgreeList clear">
                    <li>
                        <span class="pingAgreelabel">超时时间(s)：</span>
                        <el-input
                        :disabled="disabled"
                        v-model="pingObj.timeout"
                        size="mini"
                        placeholder="请输入超时时间"></el-input>
                    </li>
                    <li>
                        <span class="pingAgreelabel">发送次数(次)：</span>
                        <el-input
                        :disabled="disabled"
                        v-model="pingObj.count"
                        size="mini"
                        placeholder="请输入发送次数"
                        ></el-input>
                    </li>
                    <li>
                        <span class="pingAgreelabel">数据包（字节）：</span>
                        <el-input
                        :disabled="disabled"
                        v-model="pingObj.packet_size"
                        size="mini"
                        placeholder="请输入大小"></el-input>
                    </li>
                </ul>
            </div>
        </div>

        <div v-show="active == 'HTTP' " class="protocolFilter">
            <div class="agreementContent">
                <ul class="pingAgreeList clear">
                    <li>
                        <span class="pingAgreelabel">协议选择：</span>
                        <el-radio
                        :disabled="disabled"
                        v-model="httpObj.protocol"
                        :label="'HTTP1.1'">HTTP1.1</el-radio>
                    </li>
                    <li>
                        <span class="pingAgreelabel">超时时间（s)：</span>
                        <el-input
                        :disabled="disabled"
                        v-model="httpObj.timeout"
                        size="mini"
                        placeholder="请输入超时时间"></el-input>
                    </li>
                    <li>
                        <span class="pingAgreelabel">允许重定向：</span>
                        <el-switch
                        :disabled="disabled"
                        v-model="httpObj.is_redirect"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        ></el-switch>
                    </li>
                    <li>
                        <span class="pingAgreelabel">最大重定向数：</span>
                        <el-input
                        v-model="httpObj.redirect_count"
                        :disabled="disabled || !httpObj.is_redirect"
                        placeholder="请输入数量"
                        type="number"
                        size="mini"
                        ></el-input>
                    </li>
                    <li>
                        <span class="pingAgreelabel">页面快照：</span>
                        <el-switch
                        :disabled="disabled"
                        v-model="httpObj.is_snap"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        ></el-switch>
                    </li>
                </ul>
                <div id="jsonEditorBox" class="clear">
                    <div class="fl item">
                        <h4 class="title">
                        认证(Authorization)
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">目前，仅支持basic类型的安全验证.<br/>basic类型，格式如下:<br/>
                            {
                            'auth_type': 'basic',
                            'auth_user': '{username}:{password}'
                            }</div>
                            <span class="el-icon-question"></span>
                        </el-tooltip>
                        </h4>
                        <div id="authBox"></div>
                    </div>
                    <div class="fl item">
                        <h4 class="title">头部(headers)</h4>
                        <div id="headerBox"></div>
                    </div>
                    <div class="fl item">
                        <h4 class="title">主体(Body)</h4>
                        <div id="bodyBox"></div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="active == 'DNS'" class="protocolFilter">
           <div class="agreementContent">
                <ul class="pingAgreeList clear">
                    <li>
                        <span class="pingAgreelabel">DNS设置：</span>
                        <el-radio-group v-model="dnsObj.is_default" :disabled="disabled">
                                <el-radio  :label="true" >默认</el-radio>
                                <el-radio  :label="false" >自定义</el-radio>
                        </el-radio-group>
                        <el-input
                        v-model="dnsObj.dns_server"
                        size="mini"
                        placeholder="请输入IP地址"
                        :disabled="disabled || dnsObj.is_default"
                        ></el-input>
                    </li>
                    <li>
                        <span class="pingAgreelabel">超时时间(s)：</span>
                        <el-input
                        :disabled="disabled"
                        v-model="dnsObj.timeout"
                        size="mini"
                        placeholder="请输入超时时间"
                        ></el-input>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    
</template>

<script>
export default {
    name:'protocolConfig',
    props:{
        active:{
            type:String,
            default:"PING",
            required:true
        },
        disabled:{
            type:Boolean,
            default:false
        },
        protocolConfig:{
            type:Object
        }
        
    },
    data() {

        return {
            pingObj:{
                timeout:1,
                count:10,
                packet_size:55
            },
            httpObj:{
                protocol:"HTTP1.1",
                timeout:600,
                is_redirect:true,
                redirect_count:5,
                is_snap:false,
                auth_info: null,
                header_info: null,
                body_info: null
            },
            dnsObj:{
                is_default:true,
                timeout:10,
                dns_server:null
            },
            authEditor:null,
            headerEditor:null,
            bodyEditor:null,
            options: {
                mode: "code",
                mainMenuBar: false,
            },

           
        };
    },
    created(){
       
    },
    watch:{
        active:function(newval,oldval){
            this.inittialProtocol()
        }
    },
    mounted(){
        this.inittialProtocol()
    },
    methods: {
        inittialProtocol(){
            switch(this.active){
                case "PING":
                    this.pingObj = this.isObjEmpty(this.protocolConfig) == "{}" ? this.pingObj : {...this.protocolConfig};
                    break;
                case "HTTP":
                    this.httpObj = this.isObjEmpty(this.protocolConfig) == "{}" ? this.httpObj : {...this.protocolConfig};
                    if(!this.disabled){
                        this.initHttp()
                    }else{
                        this.initEditorinfo()
                    }
                    break;
                case "DNS":
                    this.dnsObj =  this.isObjEmpty(this.protocolConfig) == "{}" ? this.dnsObj : {...this.protocolConfig};
                    break;
            }
        },
        initHttp(){
            if (this.authEditor == null){
                let container1 = document.getElementById("authBox");
                
                this.authEditor = this.initEditor(container1, this.options);
                if(this.httpObj.auth_info){
                    let json = JSON.parse(this.httpObj.auth_info)
                    this.authEditor.set(json)
                }
            }
            if(this.headerEditor == null){
                let container2 = document.getElementById("headerBox");
                this.headerEditor = this.initEditor(container2, this.options);
                if(this.httpObj.header_info){
                    let json = JSON.parse(this.httpObj.header_info)
                    this.headerEditor.set(json)
                }
            }
            if(this.bodyEditor == null){
                let container3 = document.getElementById("bodyBox");
                this.bodyEditor = this.initEditor(container3, this.options);
                if(this.httpObj.body_info){
                    let json = JSON.parse(this.httpObj.body_info)
                    this.bodyEditor.set(json)
                }
            }
        },
        
        initEditor(dom, option) {
            return new JSONEditor(dom, this.options)
        },
        initEditorinfo(){
            this.options = {
                mode: "text",
                mainMenuBar: false,
                onEditable: function(node) {
                    if (!node.path) {
                        // In modes code and text, node is empty: no path, field, or value
                        // returning false makes the text area read-only
                        return false;
                    }
                },
                onError: function(err) {
                    alert(err.toString());
                }
                
            }
            this.authEditor = null
            this.headerEditor = null
            this.bodyEditor = null
            this.init()

        },
        getHttpJson() {
            if(this.authEditor != null){
                this.httpObj.auth_info = JSON.stringify(this.authEditor.get())
                this.httpObj.header_info = JSON.stringify(this.headerEditor.get())
                this.httpObj.body_info = JSON.stringify(this.bodyEditor.get())
            }
      
        },
        isObjEmpty(obj){
            
            return JSON.stringify(obj)
        }
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.agreementContent .el-input{
    width:120px;
}
</style>
<style scoped>
@import "../../../../../static/css/protocolConfig.css";
</style>
