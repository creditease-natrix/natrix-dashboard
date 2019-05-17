// Copy from newOrganiaztion.vue， this component return a list of organization id.
<template>
  <div class="selectBox" id="departmentBox">
    <!-- <span>组织选择：</span> -->
    <el-select
      @change="getDefaultList(index,item.selected)"
      v-for="(item,index) in selectData"
      :key="index"
      v-model="item.selected"
      size="mini"
      placeholder="请选择"
    >
      <el-option
        v-for="(item1,index1) in item.selectOptions"
        :key="index1"
        :label="item1.label"
        :value="item1.value"
      ></el-option>
    </el-select>
  </div>
</template>
<style scoped>
.selectBox .el-select {
  margin: 10px 30px 0 0;
}
</style>
<script>
export default {
  name: "organizationSelect",
  data() {
    return {
      selectData: [],
      // The root of organization.
      rootParentId: 1,
      selectParentId: 1,
      selectListArray: []
    };
  },
  mounted() {
    // Initialize Select component.
    this.initComponent()
  },
  methods: {
    /**
     * 
     */
    initComponent(){
      this.getDefaultList(0)
    },
    /**
     * Get selected list of organizations.
     *
     */
    getSelectList() {
      let selectList = [this.rootParentId];
      this.selectData.forEach(item => {
        selectList.push(item.selected);
      });
      this.selectListArray = selectList;
      return selectList;
    },
    /**
     *
     * @param {Number} index: The index of current select in selectData
     * @param {Number} id: The parent id of current select
     */
    getDefaultList(index, parentId = this.rootParentId) {
      // let selectDataTemp = JSON.parse(JSON.stringify(this.selectData))
      let selectDataTemp = this.selectData

      if (selectDataTemp.length > index) {
        selectDataTemp[index].selected = parentId;
      }
      // special condition: user select 'all' option
      if (parentId == 0) {
        selectDataTemp.splice(index + 1, selectDataTemp.length - index - 1);
        if (index > 0) {
          this.selectParentId = selectDataTemp[index - 1].selected;
        } else {
          this.selectParentId = this.rootParentId;
        }
        this.emitResponse()
      } else {
        let that = this
        this.$get({
          url: HP1 + "/terminal/organization/children/v1",
          data: {
            parent: parentId
          }
        }).then(res => {
          let selectOptions = [
            {
              value: 0,
              label: "全部"
            }
          ];
          //
          if (res.data.code == 200) {
            res.data.info.forEach((item, index) => {
              selectOptions.push({
                value: item.id,
                label: item.name
              });
            });
            // truncate selectData
            if (index < selectDataTemp.length) {
              selectDataTemp.splice(
                index + 1,
                selectDataTemp.length - index - 1
              );
            }
            selectDataTemp.push({
              selected: 0,
              selectOptions: selectOptions
            });

            if (selectDataTemp.length > 1) {
              that.selectParentId = parentId;
            } else {
              that.selectParentId = that.rootParentId;
            }
            that.emitResponse()
          }
        });
      }
    },
   
    emitResponse(){
      this.$emit("getParentId", this.getSelectList());
    }
  },

};
</script>
