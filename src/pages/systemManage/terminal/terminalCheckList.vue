<template>
    <div>
        <div id="nav">
            <span class="title">终端管理——终端设备校验列表</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href=href class="home"> 管理系统 <i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{ path: '' }">终端管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/terminalCheckList' }">终端设备校验</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="optionBox clear">
            <span class="listOption">
                <el-checkbox-group v-model="checkList">
                    <el-checkbox label="不活跃"></el-checkbox>
                    <el-checkbox label="无登记组织"></el-checkbox>
                    <el-checkbox label="组织信息不一致"></el-checkbox>
                </el-checkbox-group>
            </span>
            <el-input
                id="searchBtn"
                style="width: 300px;
                       float: right;"      
                placeholder="根据mac、ip、客户端版本和组织名称搜索"
                size="mini"
                v-model="searchWord"
                @keyup.enter.native="getTerminalCheckList(1)"
            >
                <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
                <el-button slot="append" icon="el-icon-search" size="mini" @click="getTerminalCheckList(1)">查询</el-button>
            </el-input>
            
        </div>
        <el-table
            :data="tableData"
            :span-method="tableSpan"
            border
            style="width: 100%,margin-top:50px;">
            <el-table-column
            prop="sn"
            label="序列号"
            width="170">
                <template slot-scope="scope">
                    <a class="nameLink" @click="getTerminalDetail(scope.row.sn)">{{scope.row.sn}}</a>
                </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="登记职场"
            >
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" v-for="(item1,index1) in scope.row.reg_orgs" :key="index1">
                        <p>名称: {{ item1.desc }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ item1.name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
            prop="type"
            
            label="检测职场">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" v-for="(item1,index1) in scope.row.detect_orgs" :key="index1">
                        <p>名称: {{ item1.desc }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ item1.name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
            prop="terminal_name"
            width="120"
            label="终端名称">

                <!-- <template slot-scope="scope">
                    <ul class="terminalList">
                        <li v-for="(item,index) in scope.row.terminals" :key="index" class="terminal">
                            {{item.name}}
                        </li>
                    </ul>
                </template> -->
            </el-table-column>
            <el-table-column
            prop="terminal_local_ip"
            width="120"
            label="IP地址">
                <!-- <template slot-scope="scope">
                    <ul class="terminalList">
                        <li v-for="(item,index) in scope.row.terminals" :key="index" class="terminal">
                            {{item.local_ip}}
                        </li>
                    </ul>
                </template> -->
            </el-table-column>
            <el-table-column
            prop="terminal_status"
            width="120"
            label="终端状态">
                <template slot-scope="scope">
                    <span class="terminalStatus" :class="{success:scope.row.terminal_is_active,error:!scope.row.terminal_is_active }">{{scope.row.terminal_status}}</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="status"
            width="120"
            label="状态">
                
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="warning"
                        @click="handleEdit(scope.$index, scope.row)">
                        修改
                    </el-button>
                    
                </template>
            </el-table-column>
        </el-table>
        <page :pageCount='page_Count' 
        v-on:page-change='pageChangeHandle' 
        v-show="pageShow"></page>
        
    </div>  
</template>

<script>
import page from '../../../components/page'

export default {
    name:'',
    components:{
       page
    },
    data() {
        return {
            href: ManageIndex,
            page_Count:1,
            pageShow:false,
            tableData:[],
            searchWord:'',
            checkList:['无登记组织','组织信息不一致'],
            inactive:false,
            unregister:true,
            unmatch:true,
            span_col_index: [0, 1, 2, 6,7]
           
            
        };
    },
    created(){
       
    },
    watch:{
        checkList:function(newval,oldval){
            if(newval.indexOf("不活跃")!= -1){
                this.inactive = true
            }else{
                this.inactive = false
            }
            if(newval.indexOf("无登记组织")!= -1){
                this.unregister = true
            }else{
                this.unregister = false
            }
            if(newval.indexOf("组织信息不一致")!= -1){
                this.unmatch = true
            }else{
                this.unmatch = false
            }
            this.getTerminalCheckList(1)
        }
        
    },
    mounted(){
        this.getTerminalCheckList(1)
    },
    methods: {
        pageChangeHandle(currentPageNum){
            this.getTerminalCheckList(currentPageNum)
        },
        getTerminalCheckList(num){
            this.$get({
                url:HP1+"/terminal/device/exceptions/v1",
                data:{
                    inactive:this.inactive,
                    unregister:this.unregister,
                    unmatch:this.unmatch,
                    search:this.searchWord,
                    is_paginate:true,
                    pagenum:num


                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.updateTableData(res.data.info)
                    this.page_Count = res.data.page_count
                    this.pageShow = this.page_Count > 0 ? true :false

                }
            })
        },
        handleEdit(index,row){
            this.$router.push({
                path:'editTerminal',
                query:{
                    sn:row.sn
                }
            })
        },
        getTerminalDetail(sn){
            this.$router.push({
                path:'terminalDetail',
                query:{
                    sn:sn
                }
            })
        },
        updateTableData(data){
            this.tableData = []
            
            data.forEach(item => {
                let row_template = {
                    sn: item.sn,
                    detect_orgs: item.detect_orgs,
                    reg_orgs: item.reg_orgs,
                    status: this.$t(item.status),
                    terminal_local_ip: null,
                    terminal_name: null,
                    terminal_status: null,
                    terminal_is_active: null,
                }
                let terminals = item.terminals
                row_template['row_num'] = terminals.length > 0? terminals.length: 1
                row_template['index'] = 0
                
                if (terminals.length == 0){
                    this.tableData.push(row_template)
                }else{
                    terminals.forEach((t, index) => {
                        let temp = {}
                        temp = Object.assign(temp, row_template)

                        temp.index= index
                        temp.terminal_local_ip = t.local_ip,
                        temp.terminal_name = t.name,
                        temp.terminal_status = this.$t(t.status),
                        temp.terminal_is_active = t.is_active,
                        this.tableData.push(temp)
                        
                    })
                }
                
                
                
            });
            


        },
        tableSpan({row, column, rowIndex, columnIndex}){
            if (this.span_col_index.indexOf(columnIndex) != -1){
                if (row.index == 0){
                    return {
                        rowspan: row.row_num,
                        colspan: 1,
                    }
                }else{
                    return {
                        rowspan: 0,
                        colspan: 0,
                    }
                }

            }
            
            
        }

        

    }
};
</script>
<style>

.el-tag{
    margin-bottom:5px;
}
.el-table td div{
    display:inline-block;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.optionBox{
    line-height:30px;
    margin-bottom:20px;
    margin-top:20px;
}
.terminalList{
    width:100%;
}
.terminal{
    border-bottom:1px solid #ececec;
    width:100%;
    font-size:14px;
    line-height: 30px;
    text-align:center;
}
.nameLink{
    color:#409EFF;
    cursor: pointer;
}
.terminalStatus{
    display:inline-block;
    font-size:14px;
    line-height:30px;
    color:#fff;
    padding:0 5px;
    border-radius:5px;
}
.success{
    background:#67C23A;
}
.error{
    background:#F56C6C;
}
</style>
