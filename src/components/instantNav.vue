<template>
    <div class="instantNav">
        <span :class="{active: activevalue == index}" 
        class="cursor"
        v-for="(item,index) in navData" 
        :key="index"
        @click="pageRedirect(index)"
        >{{item}}
        </span>
    </div>
    
</template>

<script>

export default {
    name: 'instantNav',
    props:['active'],
    data () {
        return {
           activevalue:this.active,
           navData:[
               'PING','HTTP','Traceroute','DNS',
            //    'Performance'
           ]
        }
    },
    created(){
       
    },
    methods:{
        pageRedirect(index){
            this.activevalue = index
            if(this.activevalue == 0){
                this.$router.push({
                    path:'pingAnalysis'
                })
            }else if(this.activevalue == 1){
                this.$router.push({
                    path:'httpAnalysis'
                })
            }else if(this.activevalue == 2){
                this.$router.push({
                    path:'tracerouteAnalysis'
                })
            }else if(this.activevalue == 3){
                this.$router.push({
                    path:'dnsAnalysis'
                })
            }

        }
    },
    
    watch:{
        
    }

}
</script>
<style>

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.instantNav{
    width:100%;
    margin-bottom:10px;

}
.instantNav span{
    display:inline-block;
    padding:5px 15px;
    font-size:14px;
    line-height:30px;
    color:#333;
    border:1px solid #ebebeb;
    border-radius:5px;
    margin-right: 10px;
    background:#fff;


}
.instantNav span.active{
    background:#409EFF;
    color:#fff;
}
</style>
