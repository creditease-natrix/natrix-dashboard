<template>
    <div class="navBox">
        <ul class="navList clear">
          <li
            v-for="(item,index) in navData"
            class="cursor"
            @click="tabClick(index)"
            v-bind:class="{active: active == index}"
            :key="index"
          >{{item.name}}</li>
        </ul>
    </div>
    
</template>

<script>
export default {
    name:'timedNav',
    props:{
        navData:{
            type:Array,
            
        },
        
        
    },
    data() {

        return {
            active:0
            
        };
    },
    created(){
      
    },
    
    mounted(){
        // this.active = this.activeIndex
    },
    methods: {
        tabClick(index) {
            this.active = index;
            this.$emit("handle",index)
        },
       

        
    }
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
<style scoped>
@import "../../../../../static/css/resetEle.css";
.navList {
    border: 1px solid #ebebeb;
    box-shadow: 0 0 8px rgba(232, 237, 250, 0.6);
    border-radius: 5px;
    border-bottom: none;
    margin-bottom: -1px;
}

.navList li {
    line-height: 40px;
    font-size: 14px;
    border-right: 1px solid #ebebeb;
    float: left;
    padding: 0px 20px;
    border-bottom: 1px solid #ebebeb;
}

.navList li.active {
    border-bottom: none;
    background: #409eff;
    color: #fff;
}
</style>
