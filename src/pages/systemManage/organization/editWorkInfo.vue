<template>
    <div>
        <div id="nav">
            <span class="title">组织管理——修改组织信息</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href=href class="home"> 管理系统 <i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{ path: '' }">组织管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/workInfoManage' }">组织信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form 
        :model="ruleForm" 
        size="mini"
        :rules="rules" 
        ref="ruleForm" 
        label-width="140px" class="demo-ruleForm">
            
            
            <el-form-item label="组织名称" prop="departmentName">
                <el-input v-model="ruleForm.departmentName"  style="width:500px" placeholder="请输入组织名称"></el-input>
            </el-form-item>
            <el-form-item label="上级组织" prop="parentDepartment">
                <el-input v-model="ruleForm.parentDepartment" 
                style="width:500px" 
                disabled
                placeholder="请输入上级组织"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input v-model="ruleForm.note" type="textarea" style="width:500px" placeholder="请输入备注信息"></el-input>
            </el-form-item>
            <el-form-item label="组织地址信息" prop="region">
                <el-button type="primary" 
                size="mini" 
                icon="el-icon-plus" 
                style="margin-bottom:20px;"
                @click="addAddress">增加</el-button>
                <el-table
                :data="addressInfoData"
                size="mini"
                border
                style="width: 100%,margin-top:30px;">
                    <el-table-column
                    prop="province"
                    label="省/直辖市"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="city"
                    label="市/区"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="postcode"
                    label="邮政编码"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="详细地址"
                    >
                    </el-table-column>
                    
                    <el-table-column
                    prop=""
                    label="操作"
                    >
                        <template slot-scope="scope">
                           <el-button
                            size="mini"
                            type="danger"
                            @click="handleDeleteAddress(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>

            </el-form-item>
            <el-form-item label="组织网络信息" prop="region">
                <el-button type="primary" 
                size="mini" 
                icon="el-icon-plus" 
                style="margin-bottom:20px;"
                @click="addNet">增加</el-button>
                <el-table
                :data="addressData"
                size="mini"
                border
                style="width: 100%,margin-top:30px;">
                    
                    <el-table-column
                    prop="segment"
                    label="网段"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="gateway"
                    label="网关"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="segment_type_verbosename"
                    label="网络类型"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="comment"
                    label="备注"
                    >
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label="操作"
                    >
                        <template slot-scope="scope">
                           <el-button
                            size="mini"
                            type="danger"
                            @click="handleDeleteNet(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>

            </el-form-item>
            <el-form-item label="组织联系人信息" prop="region">
                <el-button type="primary" 
                size="mini" 
                style="margin-bottom:20px;"
                icon="el-icon-plus" 
                @click="addContact">增加</el-button>
                <el-table
                :data="contactInfoData"
                size="mini"
                border
                style="width: 100%,margin-top:30px;">
                    <el-table-column
                    prop="name"
                    width="180"
                    label="姓名"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="telephone"
                    label="电话"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="email"
                    width="180"
                    label="邮箱"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="wechat"
                    label="微信"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="identity_verbosename"
                    label="职能"
                    >
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label="操作"
                    >
                        <template slot-scope="scope">
                           <el-button
                            size="mini"
                            type="danger"
                            @click="handleDeleteContact(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>

            </el-form-item>
            <el-form-item label="组织宽带信息" >
                <el-button type="primary" 
                size="mini" 
                style="margin-bottom:20px;"
                icon="el-icon-plus" 
                @click="addBroadBand">增加</el-button>
                <el-table
                :data="broadBandData"
                size="mini"
                border
                style="width: 100%,margin-top:30px;">
                    <el-table-column
                    prop="name"
                    label="宽带名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="operator_verbosename"
                    label="运营商"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="speed"
                    label="宽带速度"
                    >
                    </el-table-column>
                    <!-- <el-table-column
                    prop="start_time"
                    label="租期开始时间"
                    >
                    </el-table-column> -->
                    <el-table-column
                    prop="end_time"
                    
                    label="租期结束时间"
                    >
                    </el-table-column>
                    
                    <el-table-column
                    prop="staff_contact"
                    label="公司宽带负责人"
                   
                    >
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p v-if="scope.row.staff_contact_email != '' ">邮箱: {{ scope.row.staff_contact_email }}</p>
                                <p v-else>邮箱: 暂无</p>
                                <p v-if="scope.row.staff_contact_telephone != '' ">电话: {{ scope.row.staff_contact_telephone }}</p>
                                <p v-else>电话: 暂无</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" v-if="scope.row.staff_contact != '' ">{{ scope.row.staff_contact }}</el-tag>
                                    <el-tag size="medium" v-else>暂无</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    
                    <el-table-column
                    prop="isp_contact"
                    label="运营商负责人"
                    >
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p v-if="scope.row.isp_contact_email != '' ">邮箱: {{ scope.row.isp_contact_email }}</p>
                                <p v-else>邮箱: 暂无</p>
                                <p v-if="scope.row.isp_contact_telephone != '' ">电话: {{ scope.row.isp_contact_telephone }}</p>
                                <p v-else>电话: 暂无</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" v-if="scope.row.isp_contact !='' ">{{ scope.row.isp_contact }}</el-tag>
                                    <el-tag size="medium" v-else>暂无</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label="操作"
                    >
                        <template slot-scope="scope">
                           <el-button
                            size="mini"
                            type="danger"
                            @click="handleDeleteBroadband(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>

            </el-form-item>
            <el-form-item label="组织网络出口信息" prop="region">
                <el-button type="primary" 
                size="mini" 
                style="margin-bottom:20px;"
                icon="el-icon-plus" 
                @click="addExport">增加</el-button>
                <el-table
                :data="exportData"
                size="mini"
                border
                style="width: 100%,margin-top:30px;">
                    <el-table-column
                    prop="type_verbosename"
                    label="出口类型"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="device_verbosename"
                    label="出口设备"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ip"
                    label="出口IP"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="comment"
                    label="备注"
                    >
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label="操作"
                    >
                        <template slot-scope="scope">
                           <el-button
                            size="mini"
                            type="danger"
                            @click="handleDeleteExport(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>

            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
                <el-button @click="resetForm('ruleForm')" type="warning" size="mini">取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="添加网段信息"  
        :visible.sync="dialogNetVisible">
            <el-form 
            :model="netform" 
            label-width="80px" 
            :rules="netfromrules" 
            ref="netform" 
            size="mini">
                
                <el-form-item label="网段" prop="segment">
                    <el-input 
                    v-model="netform.segment"
                    @blur="getNetWorkInfo()"
                    placeholder="例：192.168.1.0/24"
                    auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="网关" prop="gateway">
                    <el-input v-model="netform.gateway" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="segment_type">
                    <el-select v-model="netform.segment_type" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in typeoptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input v-model="netform.comment" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="resetNetForm('netform')" size="mini">取 消</el-button>
                <el-button type="primary"  @click="submitNetForm('netform')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        
        <el-dialog 
        title="添加联系人信息" 
        :visible.sync="dialogContactVisible">
            <el-form 
            :model="contactform" 
            size="mini" 
            :rules="contactfromrules" 
            ref="contactform" 
            label-width="80px">
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="contactform.email" auto-complete="off" @blur="getContactInfo()"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="contactform.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" >
                    <el-input v-model="contactform.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="职能" prop="identity">
                    <el-select v-model="contactform.identity" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="微信" >
                    <el-input v-model="contactform.wechat" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input v-model="contactform.comment" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="resetContactForm('contactform')" size="mini">取 消</el-button>
                <el-button type="primary" @click="submitContactForm('contactform')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加宽带信息" 
         :visible.sync="dialogBroadbandVisible">
            <el-form 
            :model="broadBandform" 
            label-width="130px" 
            :rules="broadBandformrules" 
            ref="broadBandform" 
            size="mini">
                <el-form-item label="合同编号" >
                    <!-- <el-input v-model="broadBandform.name" auto-complete="off"></el-input> -->
                    <p>YX-666-888</p>
                </el-form-item>
                <el-form-item label="宽带名称" prop="name">
                    <el-input v-model="broadBandform.name" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="运营商" prop="operater">
                    <el-select v-model="broadBandform.operater" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in operatorOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="宽带接入类型" prop="accessType">
                    <el-select v-model="broadBandform.accessType" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in accessTypes"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="速度" prop="speed">
                    <el-input v-model="broadBandform.speed" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="租期开始时间" >
                    <el-date-picker
                        v-model="broadBandform.starttime"
                        type="date"
                        :picker-options="pickerOptions"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="租期结束时间" prop="endtime">
                   <el-date-picker
                        v-model="broadBandform.endtime"
                        type="date"
                        :picker-options="pickerOptions0"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="公司负责人姓名">
                    <el-input v-model="broadBandform.companyName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司负责人电话" prop="companyTel">
                    <el-input v-model="broadBandform.companyTel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司负责人邮箱" prop="companyEmail">
                    <el-input v-model="broadBandform.companyEmail" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="运营商负责人姓名">
                    <el-input v-model="broadBandform.operaterName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="运营商负责人电话" prop="operaterTel">
                    <el-input v-model="broadBandform.operaterTel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="运营商负责人邮箱" prop="operaterEmail">
                    <el-input v-model="broadBandform.operaterEmail" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input v-model="broadBandform.note" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="resetbroadBandform('broadBandform')" size="mini">取 消</el-button>
                <el-button type="primary"  @click="submitbroadBandform('broadBandform')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog 
        title="添加出口信息" 
        :visible.sync="dialogExportVisible">
            <el-form 
            :model="exportform" 
            size="mini" 
            :rules="exportformrules" 
            ref="exportform" 
            label-width="80px">
                <el-form-item label="出口类型" prop="type">
                    <el-select v-model="exportform.type" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in exporttypeoption"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出口设备">
                    <el-select v-model="exportform.device" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in deviceoptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出口IP" prop="ip">
                    <el-input v-model="exportform.ip" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input v-model="exportform.comment" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="resetExportForm('exportform')" size="mini">取 消</el-button>
                <el-button type="primary" @click="submitExportForm('exportform')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加组织地址信息" 
        :visible.sync="dialogAddressVisible"
        >
            <el-form 
            :model="addressForm" 
            label-width="100px" 
            :rules="addressFormrules" 
            ref="addressForm" 
            size="mini">
                <el-form-item label="省/直辖市" prop="province">
                    <el-select 
                    v-model="addressForm.province" 
                    @change="getCity(),getAddressInfo()"
                    placeholder="请选择">
                        <el-option
                        v-for="(item,index) in provinces"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="市/区" prop="city">
                    <el-select v-model="addressForm.city" 
                    @change="getAddressInfo()"
                    placeholder="请选择">
                        <el-option
                        v-for="(item,index) in cities"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="addressForm.address" auto-complete="off" @blur="getAddressInfo()"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码" prop="postcode">
                    <el-input v-model="addressForm.postcode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input v-model="addressForm.comment" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="resetAddressForm('addressForm')" size="mini">取 消</el-button>
                <el-button type="primary"  @click="submitAddressForm('addressForm')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    
</template>

<script>
import {toMyStr} from '../../../until/index.js' 
import {toMyTime} from '../../../until/index.js' 
export default {
    name:'',
    components:{
      
    },
    data() {
        var validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱地址'));
            } else {
                var emailReg=/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g; 
                if( !emailReg.test(value)){
                    callback(new Error('请输入正确的邮箱地址'));
                }
                callback();
            }
        };
        var validateTel = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入电话'));
            } else {
                var telReg=/^[1][3,4,5,7,8,9][0-9]{9}$/;  
                if (!telReg.test(value)) {  
                    callback(new Error('请输入正确格式的电话号码'));
                }  
                
                callback();
            }
        };
        
        var validateIp = (rule,value,callback) =>{
            if (value === '') {
                callback(new Error('请输入网段'));
            } else {
                var ipReg =  
                /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/([0-9]|[1-2][0-9]|3[0])$/
                if (!ipReg.test(value)) {  
                    callback(new Error('请输入正确格式的网段'));
                }  
                
                callback();
            } 
           
        }
        var validateexportIp = (rule,value,callback) =>{
            if (value === '') {
                callback(new Error('请输入出口IP'));
            } else {
                var ipReg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!ipReg.test(value)) {  
                    callback(new Error('请输入正确格式的IP地址'));
                }  
                
                callback();
            } 
           
        }
        return {
            href:ManageIndex,
            ruleForm:{
                departmentName:'',
                parentDepartment:'',
                note:'',
            },
            pickerOptions:{
                disabledDate:(time) =>{
                    if (this.broadBandform.endtime) {
                        return time.getTime() >= new Date(this.broadBandform.endtime).getTime()
                    } 
                    // } else {
                    //     return time.getTime() > Date.now();
                    // }
                },
            },
            pickerOptions0:{
                disabledDate:(time) =>{
                    if(this.broadBandform.starttime){
                        return time.getTime() < Date.now() || 
                        time.getTime() < new Date(this.broadBandform.starttime).getTime()
                    }else{
                        return time.getTime() < Date.now()
                    }
                    
                }
            },
            rules:{
                departmentName: [
                    { required: true, message: '请输入组织名称', trigger: 'blur' },
                    
                ],
                parentDepartment: [
                    { required: false, message: '请输入上级组织名称', trigger: 'blur' },
                    
                ],
                
            },
            contactInfoData:[],//联系人信息
            addressData:[],//网段地址信息
            broadBandData:[],//宽带信息
            exportData:[],//出口信息
            addressInfoData:[],//组织地址信息
            dialogContactVisible:false,//联系人弹窗
            dialogNetVisible:false,//网络
            dialogBroadbandVisible:false,//宽带
            dialogExportVisible:false,//出口
            dialogAddressVisible:false,//组织地址
            typeoptions:[
                {
                    value: 'mix',
                    label: '混合'
                }, {
                    value: 'wired',
                    label: '有线'
                },
                {
                    value: 'wireless',
                    label: '无线'
                }

            ],
            netform:{
                segment:'',//网段
                gateway:'',//网关
                segment_type:'mix',
                segment_type_verbosename:'混合',
                comment:''
            },
            options:[
                {
                    value: 'admin',
                    label: '管理员'
                }, {
                    value: 'user',
                    label: '普通用户'
                }
            ],
            contactform:{
                name:'',
                email:'',
                telephone:'',
                wechat:'',
                identity:'user',
                identity_verbosename:'普通用户',
                comment:'',
                
            },
            netfromrules:{
                
                segment: [
                    { required: true, message: '请输入网段', trigger: 'blur' },
                    { validator:validateIp,trigger: 'blur'}
                ],
                gateway:[
                    { required: true, message: '请输入网关', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'change' },
                    
                ],
            },
            contactfromrules:{
                name: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' },


                ],
                email: [
                    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
                    { validator:validateEmail,trigger: 'blur'}
                ],
                telephone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { validator:validateTel,trigger: 'blur'}
                ],
                function: [
                    { required: true, message: '请选择职能', trigger: 'change' },
                    
                ],
            },
            accessTypes:[
                {
                    value:'static',
                    label:'静态'
                },
                {
                    value:'dynamic',
                    label:'动态'
                },
                {
                    value:'unknown',
                    label:'未知'
                },
            ],
            operatorOptions:[
                
            ],

            broadBandform:{
                name:'',
                operater:'',
                accessType:'static',
                speed:'',
                starttime:'',
                endtime:'',
                companyName:'',
                companyEmail:'',
                companyTel:'',
                operaterName:'',
                operaterTel:'',
                operaterEmail:'',
                comment:''
            },
            broadBandformrules:{
                name: [
                    { required: true, message: '请输入宽带名称', trigger: 'blur' },


                ],
                operater: [
                    { required: true, message: '请选择运营商', trigger: 'change' },
                    
                ],
                accessType:[
                    { required: true, message: '请选择宽带接入类型', trigger: 'change' },
                ],
                speed: [
                    { required: true, message: '请输入速度', trigger: 'blur' },
                    
                ],
                // endtime:[
                //     {  type: 'date',required: true, message: '请选择结束时间', trigger: 'change' },
                // ],
                
                

            },
            exportform:{
                type:'vpn',
                type_verbosename:'VPN',
                device:'checkpoint',
                device_verbosename:'CheckPoint',
                ip:'',
                comment:''

            },
            exporttypeoption:[
                {
                    value: 'vpn',
                    label: 'VPN'
                }, {
                    value: 'pn',
                    label: '专线'
                }
            ],
            deviceoptions:[
               
            ],
            exportformrules:{
                type: [
                    { required: true, message: '请选择出口类型', trigger: 'change' },


                ],
                ip: [
                    { required: true, message: '请输入IP', trigger: 'blur' },
                    { validator:validateexportIp,trigger: 'blur'}
                ],
            },
            provinces:[],
            cities:[],
            addressForm:{
                province:'',
                city:'',
                postcode:'',
                address:'',
                comment:''
            },
            addressFormrules:{
                province: [
                    { required: true, message: '请选择省份', trigger: 'change' },
                ],
                city: [
                    { required: true, message: '请选择城市', trigger: 'change' },
                ],
                address:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ]
            }


            


            
        };
    },
    created(){
       
    },
    watch:{
        

    },
    mounted(){
        this.getProvince()
        this.getDetail()
        this.getOperators()
        this.getExportType()
    },

    methods: {
        showTooltip(){

        },
        handleDeleteExport(index,row){
            this.$confirm('此操作将删除该条出口信息, 是否继续?（点击提交按钮生效）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exportData.splice(index,1)
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleDeleteBroadband(index,row){
            this.$confirm('此操作将删除该条宽带信息, 是否继续?（点击提交按钮生效）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.broadBandData.splice(index,1)
               
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleDeleteContact(index,row){
            this.$confirm('此操作将永久删除该联系人, 是否继续?（点击提交按钮生效）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.contactInfoData.splice(index,1)
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleDeleteNet(index,row){
            this.$confirm('此操作将删除该网段, 是否继续?（点击提交按钮生效）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.addressData.splice(index,1)
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        addNet(){
            this.dialogNetVisible = true
        },
        addContact(){
            this.dialogContactVisible = true
        },
        submitContactForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                   this.addContactForm()
                } else {
                    return false;
                }
            });
        },
        resetContactForm(formName) {
            this.dialogContactVisible = false
            this.$refs[formName].resetFields();
        },
        submitNetForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addNetForm()
                } else {
                    return false;
                }
            });
        },
        resetNetForm(formName) {
            this.dialogNetVisible = false
            this.$refs[formName].resetFields();
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addWork()
                } else {
                    return false;
                }
            });
        },
        resetForm(){
            this.$refs[formName].resetFields();
        },
        addWork(){
           
            this.$put({
                url:HP1+'/terminal/organization/v1',
                data:{
                    "id":Number(this.$route.query.id),
                    "name":this.ruleForm.departmentName,
                    "comment":this.ruleForm.note,
                    "addresses":this.addressInfoData,
                    "networks":this.addressData,
                    "contacts": this.contactInfoData,
                    "broadbands":this.broadBandData,
                    "exports":this.exportData


                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.$message({
                        type:'success',
                        message:res.data.message

                    })
                    this.$router.push({
                        path:"workInfoManage"
                    })
                }
            })
        },
        addContactForm(){
            let identity_verbosename 
            let contactformObj = {}
            if(this.contactform.identity == 'user'){
                identity_verbosename = '普通用户'
            }else{
                identity_verbosename = '管理员'
            }
            contactformObj = Object.assign({},this.contactform,{identity_verbosename:identity_verbosename})
            this.contactInfoData.push(
              contactformObj
            )
            this.dialogContactVisible = false
            this.contactform  ={
                name:'',
                email:'',
                telephone:'',
                wechat:'',
                identity:'user',
                identity_verbosename:'普通用户',
                comment:'',
                
            }
        },
        addNetForm(){
            let segment_type_verbosename
            if(this.netform.segment_type == 'mix'){
                segment_type_verbosename = '混合'
            }else if(this.netform.segment_type == 'wired'){
                segment_type_verbosename = '有线'
            }else{
                segment_type_verbosename = '无线'
            }
            let netformObj = {}
            netformObj = Object.assign({},this.netform,{
                segment_type_verbosename:segment_type_verbosename
            })
            this.addressData.push(
              netformObj
            )
            this.dialogNetVisible = false
            this.netform  ={
                segment:'',
                gateway:'',
                segment_type:'mix',
                segment_type_verbosename : '混合',
                comment:''
            }
        },
        getProvince(){
            this.$get({
               url:HP1+'/terminal/common/provinces/v1',
               data:{

               } 
            }).then(res=>{
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        this.provinces.push({
                            value:item,
                            label:item
                        })
                    })
                }
                
            })
        },
        getCity(){
            this.addressForm.city = ''
            this.$post({
               url:HP1+'/terminal/common/cities/v1',
               data:{
                   "provinces":this.addressForm.province.split(" ")
               } 
            }).then(res=>{
                this.cities = []
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        this.cities.push({
                            value:item,
                            label:item
                        })
                    })
                }

                
            })
        },
        addBroadBand(){
            this.dialogBroadbandVisible = true
        },
        addbroadBandForm(){
            
            if(this.broadBandform.companyTel != ''){
                var telReg=/^[1][3,4,5,7,8,9][0-9]{9}$/;  
                if (!telReg.test(this.broadBandform.companyTel)) {  
                    // callback(new Error('请输入正确格式的电话号码'));
                    this.$message({
                        type:'error',
                        message:'请输入正确格式的电话号码'
                    })
                    return false
                } 
                
            }
            
            if(this.broadBandform.companyEmail != ''){
                var emailReg=/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g; 
                if( !emailReg.test(this.broadBandform.companyEmail)){
                    // callback(new Error('请输入正确的邮箱地址'));
                    this.$message({
                        type:'error',
                        message:'请输入正确的邮箱地址'
                    })
                    return false
                }
                
            }
            
            if(this.broadBandform.operaterTel != ''){
                var telReg=/^[1][3,4,5,7,8,9][0-9]{9}$/;  
                if (!telReg.test(this.broadBandform.operaterTel)) { 
                    // callback(new Error('请输入正确格式的电话号码'));
                    this.$message({
                        type:'error',
                        message:'请输入正确格式的电话号码'
                    })
                    return false
                } 
                
            }
            if(this.broadBandform.operaterEmail != ''){
                var emailReg=/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g; 
                if( !emailReg.test(this.broadBandform.operaterEmail)){
                    // callback(new Error('请输入正确的邮箱地址'));
                    this.$message({
                        type:'error',
                        message:'请输入正确的邮箱地址'
                    })
                    return false
                }
                
            }
            let access_type_verbosename, operator_verbosename
            if(this.broadBandform.accessType == 'static'){
                access_type_verbosename = '静态'
            }else if(this.broadBandform.accessType == 'unknown'){
                access_type_verbosename = '未知'
            }else{
                access_type_verbosename = '动态'
            }
            if(this.broadBandform.operater == 'China Telecom'){
                operator_verbosename = '中国电信'
            }else if(this.broadBandform.operater == 'China Mobile'){
                operator_verbosename = '中国移动'
            }else if(this.broadBandform.operater == 'China Unicom'){
                operator_verbosename = '中国联通'
            }else{
                operator_verbosename ='其他'
            }
            this.broadBandData.push(
                {
                    name:this.broadBandform.name,
                    operator:this.broadBandform.operater,
                    operator_verbosename:operator_verbosename,
                    speed:Number(this.broadBandform.speed),
                    access_type:this.broadBandform.accessType,
                    access_type_verbosename:access_type_verbosename,
                    start_time:this.broadBandform.starttime,
                    end_time:this.broadBandform.endtime,
                    staff_contact:this.broadBandform.companyName,
                    staff_contact_email:this.broadBandform.companyEmail,
                    staff_contact_telephone:this.broadBandform.companyTel,
                    isp_contact:this.broadBandform.operaterName,
                    isp_contact_telephone:this.broadBandform.operaterTel,
                    isp_contact_email:this.broadBandform.operaterEmail,
                    comment:this.broadBandform.comment
                }
            )
            this.broadBandData.forEach((item,index)=>{
                if(item.start_time !=''){
                    item.start_time = new Date(item.start_time).toMyTime()
                }
                if(item.end_time !=''){
                    item.end_time = new Date(item.end_time).toMyTime()
                }
                
            })
            this.dialogBroadbandVisible = false
            this.broadBandform ={
                name:'',
                operater:'',
                speed:'',
                accessType:'static',
                starttime:'',
                endtime:'',
                companyName:'',
                companyEmail:'',
                companyTel:'',
                operaterName:'',
                operaterTel:'',
                operaterEmail:'',
                comment:''
            }
        },
        submitbroadBandform(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addbroadBandForm()
                } else {
                    return false;
                }
            });
        },
        resetbroadBandform(formName){
            this.dialogBroadbandVisible = false
            this.$refs[formName].resetFields();
        },
        addExport(){
             this.dialogExportVisible = true

        },
        addExportForm(){
            let typeObj , type_verbosename ,device_verbosename
            if(this.exportform.type == 'vpn'){
                type_verbosename = 'VPN'
            }else{
                type_verbosename = '专线'
            }
            if(this.exportform.device= 'checkpoint'){
                device_verbosename = 'CheckPoint'
            }
            typeObj = Object.assign({},
                this.exportform,
                {
                    type_verbosename:type_verbosename,
                    device_verbosename:device_verbosename
                }
            )
            this.exportData.push(
              typeObj
            )
            
            this.dialogExportVisible = false
            this.exportform ={
                type:'vpn',
                type_verbosename:'VPN',
                device:'',
                device_verbosename:'',
                ip:'',
                comment:''
            }
        },
        resetExportForm(formName) {
            this.dialogExportVisible = false
            this.$refs[formName].resetFields();
        },
        submitExportForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addExportForm()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getDetail(){
            this.$get({
               url:HP1+'/terminal/organization/v1',
               data:{
                   'id':this.$route.query.id
               } 
            }).then(res=>{
                if(res.data.code == 200){
                    this.ruleForm.departmentName = res.data.info.organization.name
                    this.ruleForm.parentDepartment = res.data.info.organization.parent
                    this.ruleForm.note = res.data.info.organization.comment
                    this.addressInfoData = res.data.info.addresses
                    this.addressData = res.data.info.networks
                    this.contactInfoData = res.data.info.contacts
                    this.broadBandData = res.data.info.broadbands
                    this.exportData = res.data.info.exports
                }
                
            })
        },
        addAddress(){
            this.dialogAddressVisible = true

        },
        addAddressForm(){
            let codeReg = /^[1-9][0-9]{5}$/ //邮政编码正则
            if(this.addressForm.postcode !='' && !codeReg.test(this.addressForm.postcode)){
                this.$message({
                    type:'error',
                    message:'请输入正确格式的邮政编码'
                })
                return false
            }
            this.addressInfoData.push({
                    ...this.addressForm
            })
            this.dialogAddressVisible = false


        },
        submitAddressForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addAddressForm()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetAddressForm(formName){
            this.$refs[formName].resetFields();
            this.dialogAddressVisible = false
        },
        handleDeleteAddress(index,row){
            this.addressInfoData.splice(index,1)


        },
        getOperators(){
            this.$get({
                url:HP1+"/terminal/operator/list/v1",
                data:{

                }
            }).then(res=>{
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        this.operatorOptions.push({
                            value:item.name,
                            label:item.verbose_name
                        })
                    })
                }
            })
        },
        getExportType(){
            this.$get({
                url:HP1+'/terminal/exportDeviceType/list/v1',
                data:{

                }
            }).then(res=>{
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        this.deviceoptions.push({
                            value:item.name,
                            label:item.verbose_name
                        })
                    })
                }


            })
        },
        getAddressInfo(){
            this.$get({
                url:HP1+'/terminal/organization/address/v1',
                data:{
                    province:this.addressForm.province,
                    city:this.addressForm.city,
                    address:this.addressForm.address
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.addressForm.postcode = res.data.info.postcode == null ? '': res.data.info.postcode
                    this.addressForm.comment = res.data.info.comment == null ? '': res.data.info.comment
                }

            })
        },
        getNetWorkInfo(){
            this.$get({
                url:HP1+"/terminal/organization/network/v1",
                data:{
                    segment:this.netform.segment
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.netform.gateway = res.data.info.gateway == null ? '': res.data.info.gateway
                    this.netform.segment_type = res.data.info.segment_type 
                    this.netform.comment = res.data.info.comment == null ? '': res.data.info.comment
                }
            })
        },
        getContactInfo(){
            this.$get({
                url:HP1+"/terminal/organization/contact/v1",
                data:{
                    email:this.contactform.email
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.contactform.name  = res.data.info.name == null ?'':res.data.info.name
                    this.contactform.email  = res.data.info.email == null ?'':res.data.info.email
                    this.contactform.telephone  = res.data.info.telephone == null ?'':res.data.info.telephone
                    this.contactform.wechat  = res.data.info.wechat == null ?'':res.data.info.wechat
                    this.contactform.identity  = res.data.info.identity 
                }
            })
            
        }


        
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
<style scoped>

</style>

