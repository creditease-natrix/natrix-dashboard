// tree table: transform the tree-structure into a table
<template>
    <div id="tree-table-container" class="clearfix">
            <!-- tree branch -->
            <div
                style="width: 180px;margin:10px;float:left;"
                v-for="(branch, index) in tree_table"
                :key="index">
                <el-collapse 
                    v-model="show_list"
                    :key="index">
                    <el-collapse-item 
                        :title="branch.get_text(branch.data)"
                        :name="index">
                        <div
                            v-for="(site, site_index) in branch.sites" 
                            :key="site_index +'-' + index"
                            class="text item">

                            <!-- node in each branch -->
                            <div
                                v-on:click="node_option.events.click(site.data)">
                                <el-card  :class="site.get_class(site.data)">
                                {{ site.get_text(site.data) }}
                                </el-card>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            
    </div>
</template>

<script>
export default {
    name: "treeTable",
    props: {
        tree_data: {
            type: [Object],
            default: null
        },
        branch_option: {
            type: Object,
            default: () => ({
                get_text: function(d){
                    let text = ''
                    if(d.name){
                        text += d.name
                    }
                    return text
                },
                get_class: function(d){
                    return 'normal'
                }
            })
        },
        node_option: {
            type: Object,
            default: () => ({
                get_text: function(d){
                    let text = ''
                    if(d.name){
                        text += d.name
                    }
                    return text
                },
                get_class: function(d){
                    return 'normal'
                },
                events: {
                    click: function(data){
                        window.location = '/'
                    }
                }
            })
        }
        
    },
    data () {
        return {
            tree_table: [],
            branch_width: 180,
            node_width: 120,
            show_list: []
        }
    },
    mounted () {
        // this.construct_table()
    },
    watch: {
        tree_data: {
            handler: function(newval, oldval){
                this.construct_table()
            },
            deep: true
        }
    },
    methods : {
        /**
         * construct table 
         */
        construct_table(){

            if(!this.tree_data || !this.tree_data.children){
                this.tree_table = []
                return
            }
            let that = this
            this.tree_table = []
            this.show_list = []
            let table_items = this.tree_data.children
            table_items.forEach(function(branch, index){
                that.show_list.push(index)
                that.tree_table.push({
                    visible: true,
                    data: branch,
                    get_text: that.branch_option.get_text,
                    get_class: that.branch_option.get_class,
                    sites: branch.children? branch.children.map(function(site){
                        return {
                            data: site,
                            get_text: that.node_option.get_text,
                            get_class: that.node_option.get_class,
                        }
                    }):null
                })
            })
        }
    }
}


</script>
<style>
.text{
    border-bottom:1px solid #fff;
}
.danger {
    background: #F56C6C;
}
.fine {
    background: #67C23A;
}
.normal {
    background: #4078ff6b;
}
.el-collapse-item__content{
    padding-bottom:0;
    cursor: pointer;
}
#tree-table-container .el-collapse-item__header{
    /* background: #4078ff6b; */
    /* color:#fff; */
    background:#4078ff6b;
    text-indent:5px;
    height: 30px;
    line-height: 30px;
}
#tree-table-container  .el-collapse-item__content{
    color:#444;
}
#tree-table-container .el-collapse-item__arrow{
    height: 30px;
    line-height: 30px;
}
#tree-table-container .el-collapse-item__content .unknown{
    background: #E4E7ED;
}
#tree-table-container .el-card{
    color:#444;
}
#tree-table-container{
    width: 100%;
    height: 500px;
    background: #fff;
    box-sizing: border-box;
    padding:20px;
}
#tree-table-container .el-card.danger{
    background: #F56C6C;
}
#tree-table-container .el-card.fine{
    background: #67C23A;
}
#tree-table-container .el-card.normal{
    background: #4078ff6b;
}
</style>