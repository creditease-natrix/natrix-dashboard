<template>
  <div>
    <el-table
        :data="tableData"
        border
        style="width: 100%,margin-top:50px;">
        <el-table-column
        prop="terminal"
        label="终端"
        width="125">
        </el-table-column>
        <el-table-column
        label="组织"
        width="125">
          <template slot-scope="scope">
              <div 
              v-for="(item,index) in scope.row.organizations" 
              :key="index">
                  <el-popover trigger="hover" placement="top">
                      <p>名称: {{ item }}</p>
                      <div slot="reference" class="name-wrapper">
                          <el-tag size="medium" class="tag">{{ item }}</el-tag>
                      </div>
                  </el-popover> 
              </div>
          </template>
        </el-table-column>
        <el-table-column
        prop="province"
        label="省份"
        width="100">
        </el-table-column>
        <el-table-column
        prop="city"
        width="100"
        label="市">
        </el-table-column>
        <el-table-column
        prop="operator"
        width="100"
        label="运营商">
        </el-table-column>
        <el-table-column
        prop="errorinfo"
        label="错误信息">
        </el-table-column>
        <!-- <el-table-column
        label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="info"
                @click="handleInfo(scope.$index, scope.row)">详细</el-button>
            </template>
        </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: "errorinfoTable",
  props:{
    tableData:{
      type:Array,
      required:true,
      default:[],
    }
  },
  data() {
    return {
      
      
      
    };
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    handleInfo(){

    }
    
    
   
  }
};
</script>
<style>


</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
