<template>
  <div id="workPlaceComponent">
        <span>部门</span>
        <el-select 
        id='section' 
        v-model="section"  
         
        size='mini' 
        clearable 
        placeholder="请选择"
        @blur='clear1'
        @change="getArea()"
        >
            <el-option
            v-for="(item,index) in sections"
            :key="index"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <span>大区</span>
        <el-select 
        v-model="area" 
        size='mini'
        clearable 
        placeholder="请选择"
        @blur='clear3'
        @change="getBranchCenter()"
        >
            <el-option
            v-for="(item,index) in areas"
            :key="index"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <span>分中心</span>
        <el-select 
        v-model="branchCenter" 
        size='mini' 
        clearable 
        placeholder="请选择"
        @change="getSalesDepartment()"
        >
            <el-option
            v-for="(item,index) in branchCenters"
            :key="index"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <span>营业部</span>
        <el-select 
        v-model="salesDepartment" 
        @change="getWorkPlaceId"
        size='mini' 
        clearable 
        placeholder="请选择"
       
        >
            <el-option
            v-for="(item,index) in salesDepartments"
            :key="index"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
  </div>
  
</template>

<script>

export default {
    name: 'workPlace',
    data () {
        return {
            branchCenter:'',//分中心
            branchCenters:[],
            area:'',//大区
            areas:[],
            section:'',//部门
            sections:[], 
            salesDepartment:'',//营业部
            salesDepartments:[]
        }
    },
    created(){
        
    },
    mounted(){
        this.getSection()
    },
    methods:{
        //部门
        getSection(){
            this.$get({
                url:HP1+'/raspi/get/level1s',
                data:{
                   
                }
                
            }).then(res=>{
               
                if(res.permission){
                    if(res.data.code == 200){
                        res.data.level1s.forEach((item,index)=>{
                            this.sections.push({
                                value:item,
                                label:item
                            })
                        })
                        
                    }
                }
            })
        },
        
        //大区
        getArea(){
            this.areas=[]
            this.area = ''
            this.branchCenter = ''
            this.salesDepartment = ''
            this.branchCenters=[]
            this.salesDepartments = []

            if(this.section == '' ){ 
                this.$message.error("请先选择所在部门")
                return
            }else{
                this.$post({
                    url:HP1+'/raspi/get/level2s',
                    data:{
                    'level1s': this.section
                    }
                    
                }).then(res=>{
                    
                    if(res.permission){
                        if(res.data.code == 200){
                            res.data.level2s.forEach((item,index)=>{
                                this.areas.push({
                                    value:item,
                                    label:item
                                })
                            })
                            
                        }
                    }
                })
            }
           
            
        },
        //分中心
        getBranchCenter(){
            this.branchCenters=[]
            this.branchCenter = ''
            this.salesDepartment = ''
            this.salesDepartments = []
            if(this.section == '' || this.area == ''){ 
                this.$message.error("请先选择上级机构")
                return
            }else{
                this.$post({
                    url:HP1+'/raspi/get/level4s',
                    data:{
                        'level1s': this.section,      //level1s表示匹配条件，如果没有表示全部
                        'level2s': this.area,
                    }
                    
                }).then(res=>{
                    
                    if(res.permission){
                        if(res.data.code == 200){
                            res.data.level4s.forEach((item,index)=>{
                                this.branchCenters.push({
                                    value:item,
                                    label:item
                                })
                            })
                            
                        }
                    }
                })
            }
            
            
        },
        //获取营业部信息
        getSalesDepartment(){

            this.salesDepartments = []
            this.salesDepartment = ''
            if(this.section == '' || this.area == '' || this.branchCenter == ''){ 
                this.$message.error("请先选择上级机构")
                return
            }else{
                this.$post({
                    url:HP1+'/raspi/get/workplaceLevel5s/v1',
                    data:{
                        'level1s': this.section,      //level1s表示匹配条件，如果没有表示全部
                        'level2s': this.area,
                        'level4s': this.branchCenter
                    }
                    
                }).then(res=>{
                    this.salesDepartments = []
                    if(res.data.code == 200){
                            res.data.infos.forEach((item,index)=>{
                                this.salesDepartments.push({
                                    value:item.workplace_id,
                                    label:item.level5
                                })
                            })
                            
                    }
                })
            }
            
        },
        clear1(){

        },
        clear3(){

        },
        clear(){
            
        },
        getWorkPlaceId(){
            this.$emit('getId',this.salesDepartment)
        }
        

    },
    

}
</script>
<style>
/* #workPlaceComponent el-select--mini{
    width:150px;
} */
.el-select--mini{
    width:150px;
}

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
