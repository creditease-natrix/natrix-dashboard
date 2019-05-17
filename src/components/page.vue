<template>
    <div class="pageBox">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page="currentPage"
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
        'pageCount':{
            type: Number,
            default: 1
        }
    },
    
    data () {
        return {
            currentPage:0
        }
    },
    watch:{
        pageCount:function (val,old){
            
            this.pageCount=val
            
        }
    },
    created(){
        // this.getRoutePath();
        
    },
    methods:{
        currentPageHandle(e){
            
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
    text-align: right;
}
</style>
