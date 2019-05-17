<template>
  <div>
    <div class="scoreInfo">
        <div class="score">
            <!-- <div class="circle" 
            @click="jumpScoreInfo" 
            :class="[{ green: isGreen, red: isRed,orange:isOrange,grey:isGrey }]">
                <h4 class="scoreTitle">职场评分</h4>
                <div class="scoreNumber"><b>{{score}}</b></div>
                 <el-button type="info" size='mini'>评分详情</el-button>
            </div> -->
            <!-- <div class="infoTitle" v-show="terminal">
                未检测到职场机器人<el-button type="info" size="mini" id="applyBtn" @click="apply">申请</el-button>
            </div> -->
            <div class="infoTitle" v-if="guard_time != null ">
                职场机器人守护您的职场{{guard_time}}
            </div>
            <div class="infoTitle" v-else>
                职场机器人未守护您的职场
            </div>
            <!-- <div class="infoTitle">
                <el-button type="info" size="mini" id="applyBtn">故障申报</el-button>
            </div> -->
        </div>
        <ul class="scoreList">
            <li 
            v-for="(item,index) in info" 
            :class="[{green:item.level == 20},{red:item.level == 1},{orange:item.level == 10}]"
            :key="index">
                {{item.message}}
            </li>
        </ul>
    </div>
    <!-- <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="概述" name="first">概述</el-tab-pane>
        <el-tab-pane label="服务分析" name="second">服务分析</el-tab-pane>
        <el-tab-pane label="职场信息" name="third">职场信息</el-tab-pane>
        <el-tab-pane label="局域网信息" name="fourth">局域网信息</el-tab-pane>
        <el-tab-pane label="故障信息" name="fifth">故障信息</el-tab-pane>
        <el-tab-pane label="网络测试" name="sixth">网络测试</el-tab-pane>
    </el-tabs> -->
  </div>
  
</template>

<script>

export default {
    name: 'workHeader',
    props:[
        'workId',
        'existFlag',
        'flag'

    ],
    data () {
        return {
            activeName2: 'first',
            terminal:false,
            info:[],
            guard_time:'',
            score:'',
            isGreen:false,
            isOrange:false,
            isRed:false,
            isGrey:false,
            
        
        }
    },
    mounted(){
        
        
    },
    watch:{
        flag:function(newval,oldval){
            if(newval){
                this.headerInfo()
            }
        }
    },
    methods:{
        handleClick(){

        },
        apply(){
            this.$router.push({
                path:'applyTerminal'
            })
        },
        headerInfo(){
            this.$get({
                url:HP1+'/workplaceGuard/messages',
                data:{
                   
                }
            }).then(res=>{
                if(res.permission){
                    if(res.data.code == 200){
                        this.info = res.data.info
                        this.guard_time = res.data.guard_time
                        this.score = res.data.score
                    }
                    
                    switch (true)
                    {
                        case this.score >80 && this.score <=100 :
                            this.isGreen = true
                            this.isOrange  = false
                            this.isRed = false
                            this.isGrey = false

                            break;
                        case this.score >60 && this.score <=80 :
                            this.isGreen = false
                            this.isOrange  = true
                            this.isRed = false
                            this.isGrey = false
                            break;
                        case this.score >0 && this.score <=60 :
                         
                            this.isGreen = false
                            this.isOrange  = false
                            this.isRed = true
                            this.isGrey = false
                            break;
                        default :
                            this.isGreen = false
                            this.isOrange  = false
                            this.isRed = false
                            this.isGrey = true
                            this.terminal = true //是否有树莓派设备

                        
                        
                    }
                    
                }
            })
        },
        jumpScoreInfo(){
            if(!this.terminal){
                this.$router.push({
                    path:'scoreInfo'
                })
            }
            
        }
        

    },
    

}
</script>
<style>


</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scoreInfo{
    display:flex;
    display:-webkit-flex;
    display:-moz-flex;
    flex-direction:row;
    width:100%;
}
.score{
    /* width:150px; */
    margin:0px 30px 10px 0px;
    position: relative;
}
.scoreTitle{
    font-size:20px;
    font-weight:bold;
    line-height:28px;
    height: 28px;
}
.score .circle{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: block;
    /* border: 1px solid #ddd; */
    box-shadow: 0 0 2px #ddd;
    display:flex;
    display:-webkit-flex;
    display:-moz-flex;
    justify-content:center;
    align-items:center;
    /* background: rgba(5, 176, 81, 0.8); */
    color:#fff;
    flex-direction:column;
    flex-wrap:wrap;
}
.scoreNumber{
   font-size:30px;
   font-weight:bold;
   

}
.scoreList{
    display:flex;
    display:-webkit-flex;
    display:-moz-flex;
    flex-direction:row;
    flex-wrap:wrap;
    flex:1;

}
.scoreList li{
    font-size:14px;
    height:30px;
    line-height:30px;
    margin-right:20px;
    width:300px;
    text-indent: 10px;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
}
.infoTitle{
    font-size:14px;
    height: 28px;
    line-height:1;
    margin:10px 0;

}
#applyBtn{
    /* margin-left:10px; */
}
.green{
    background:#00ff7f;
}
.orange{
    background:#ffa500;
}
.red{
    background:#ff0000;
}
.grey{
   background:#ccc; 
}
</style>
