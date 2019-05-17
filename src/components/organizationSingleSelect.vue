<template>
   <div class="singleSelect">
        组织选择：
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
         <el-button type="primary" size="mini" @click="getSelectHandle">确定</el-button>
    </div>
        
</template>
<style>


</style>
<style scoped>
.singleSelect{
    /* width: 90%;
    float: left */
}


</style>
<script>
export default {
    name:'organizationSingleSelect',
    props:{
        
    },
    data(){
        return {
            branchCenter:'全部',//分中心
            branchCenters:[
                {
                    value:'全部',
                    label:"全部"
                }
            ],
            area:'全部',//大区
            areas:[
                {
                    value:'全部',
                    label:"全部"
                }
            ],
            section:'全部',//部门
            sections:[
                {
                    value:'全部',
                    label:"全部"
                }
            ], 
            salesDepartment:'全部',//营业部
            salesDepartments:[
                {
                    value:'全部',
                    label:"全部"
                }
            ],

            


        }
        
    },
    computed:{
       
    },
    watch:{
        

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
            this.areas=[{value:"全部",label:"全部"}]
            this.area = '全部'
            this.branchCenter = '全部'
            this.salesDepartment = '全部'
            
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
            this.getBranchCenter()
            this.getSalesDepartment()
        },
        //分中心
        getBranchCenter(){
            this.branchCenters=[{value:"全部",label:"全部"}]
            this.branchCenter = '全部'
            this.salesDepartment  = '全部'
            
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
            
            this.getSalesDepartment()
            
        },
        //获取营业部信息
        getSalesDepartment(){

            this.salesDepartments = [
                {
                    value:"全部",
                    label:"全部"
                }
            ]
            this.salesDepartment = '全部'
            
            this.$post({
                url:HP1+'/raspi/get/workplaceLevel5s/v1',
                data:{
                    'level1s': this.section,      //level1s表示匹配条件，如果没有表示全部
                    'level2s': this.area,
                    'level4s': this.branchCenter
                }
                
            }).then(res=>{
                // this.salesDepartments = []
                if(res.data.code == 200){
                        res.data.infos.forEach((item,index)=>{
                            this.salesDepartments.push({
                                value:item.workplace_id,
                                label:item.level5
                            })
                        })
                        
                }
            })
            
        },
        clear1(){

        },
        clear3(){

        },
        clear(){
            
        },
        getSelectHandle(){
            let salesDepartmentValue
            this.salesDepartments.forEach((item,index)=>{
                if(item.value == this.salesDepartment ){
                    salesDepartmentValue = item.label
                }
                return false
            })
            let departMent = [this.section, this.area, this.branchCenter, salesDepartmentValue]
            this.$emit("getSelectData",departMent)
        }
    }





}


</script>
