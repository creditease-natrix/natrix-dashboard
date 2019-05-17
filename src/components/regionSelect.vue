// Copy for city.vue component.
<template>
    <div class="selectBox" >
        <!-- <span>省/直辖市：</span> -->
        <el-select 
        size="mini"
        v-model="province" 
        @change="getCityList()"
        placeholder="请选择">
            <el-option
            v-for="(item,index) in provinces"
            :key="index"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <!-- <span>市/区：</span> -->
        <el-select 
        v-model="city" 
        size="mini"
        @change="emitResponse()"
        placeholder="请选择">
            <el-option
            v-for="(item,index) in cities"
            :key="index"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>
<style scoped>

</style>
<script>
export default {
    name: "regionSelect",
    data () {
        return {
          provinces:[],
          cities:[{
              value: "all",
              label: "全部"
          }],

          province: "all",
          city: "all"
        }
    },
    mounted(){
       this.initComponent()
    },
    methods:{
        initComponent(){
            this.getProvinceList()
            this.emitResponse()

        },
        getProvinceList(){
            this.$get({
               url: HP1 + "/terminal/common/provinces/v1",
               data:{

               } 
            }).then(res=>{
                if(res.data.code == 200){
                    this.provinces = [
                         {
                            value: "all",
                            label: "全部"
                        }
                    ]
                    res.data.info.forEach((item,index)=>{
                        this.provinces.push({
                            value:item,
                            label:item
                        })
                    })
                }
            })
        },
        getCityList(){
            this.city = ""
            this.$post({
               url: HP1 + "/terminal/common/cities/v1",
               data:{
                   "provinces":this.province.split(" ")
               } 
            }).then(res=>{
                this.cities = [
                    {
                        value: "all",
                        label: "全部"
                    }
                ]
                this.city = "all"
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        this.cities.push({
                            value:item,
                            label:item
                        })
                    })
                }
                this.emitResponse()
            })
        },
        
        emitResponse(){
            this.$emit("selectList",[
                this.province, this.city
            ])
        }
    },
}
</script>
