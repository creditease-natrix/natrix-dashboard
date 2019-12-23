<template>
    <div class="selectBox" id="departmentBox">
        <el-select 
        @change="getDefaultList(index,item.selected)"
        v-for="(item,index) in selectData"
        :key="index"
        v-model="item.selected"
        size="mini"
        placeholder="请选择">
            <el-option
            v-for="(item1,index1) in item.selectOptions"
            :key="index1"
            :label="item1.label"
            :value="item1.value">
            </el-option>
        </el-select>
    </div>
        
</template>
<style scoped>
.selectBox .el-select{
    margin:10px 30px 0 0;
}
</style>
<script>
export default {
    name: 'newOrganization',
    data () {
        return {
           selectData: [],
           rootParentId: 1,
           selectParentId: 1,
        }
    },
    mounted(){
        this.getDefaultList(0)
    },
    methods:{
        /**
         * 
         * @param {Number} index The index of current select in selectData
         * @param {Number} id The parent id of current select
         */
        getDefaultList(index, parentId=this.rootParentId){

            if(this.selectData.length > index){
                this.selectData[index].selected = parentId
            }
            // special condition: user select 'all' option
            if(parentId == 0){
                this.selectData.splice(index+1,this.selectData.length-index-1)
                if(index > 0){
                    this.selectParentId = this.selectData[index-1].selected
                }else{
                    this.selectParentId = this.rootParentId
                }
                this.$emit("getParentId",this.selectParentId)
                return 
            }
           
            this.$get({
                url:HP1+"/terminal/organization/children/v1",
                data:{
                    parent: parentId
                }
            }).then(res=>{
                let selectOptions = [
                    {   
                        value:'0',
                        label:'全部'
                    }
                ]
                // 
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        selectOptions.push({
                            value:item.id,
                            label:item.name
                        })
                    })
                    // tuncate selectData
                    if(index < this.selectData.length){
                        this.selectData.splice(index+1,this.selectData.length-index-1)
                    }
                    this.selectData.push({
                        selected: '0',
                        selectOptions: selectOptions
                        })

                    if(this.selectData.length > 1){
                        this.selectParentId = parentId
                    }else{
                        this.selectParentId = this.rootParentId
                    }
                }
                this.$emit("getParentId",this.selectParentId)

            })

        },
        
    },
    
    

}


</script>
