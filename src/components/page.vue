<template>
    <div class="pageBox">
            <p class="fl totalNum">共<span>{{item_count}}</span>条记录</p>
            <el-pagination
                class="fr"
                background
                layout="prev, pager, next"
                :current-page.sync="currentPage"
                :page-count='pageCount'
                @current-change='currentPageHandle'
                @prev-click='prevClick'
                @next-click='nextClick'
            >
            </el-pagination>
    </div>
</template>

<script>

export default {
    name: 'page',
    props:{
        pageCount:{
            type: Number,
            default: 1
        },
        currentPageNum:{
            type:Number,
            default:1
        },
        item_count:{
            type:Number,
            default:0
        }
    },
    
    data () {
        return {
            currentPage:this.currentPageNum
        }
    },
    watch:{
        pageCount:function (val,old){
            this.currentPage = 1
            this.pageCount=val
        }
        
    },
    created(){
        
    },
    mounted(){
    },
    methods:{
        currentPageHandle(e){
            this.currentPage = e
            this.$emit('page-change',e)
        },
        prevClick(e){

        },
        nextClick(e){

        }

    },
    

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pageBox{
    margin:20px 0;
}
.totalNum{
    font-size:14px;
    line-height: 30px;
}
</style>
