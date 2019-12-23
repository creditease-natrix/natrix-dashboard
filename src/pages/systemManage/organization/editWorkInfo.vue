<template>
  <div>
    <div id="nav">
      <span class="title">组织管理——修改组织信息</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">
          管理系统
          <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        </a>
        <el-breadcrumb-item :to="{ path: '' }">组织管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/workInfoManage' }">组织信息管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form
      :model="ruleForm"
      size="mini"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item label="组织名称" prop="departmentName">
        <el-input v-model="ruleForm.departmentName" style="width:500px" placeholder="请输入组织名称"></el-input>
      </el-form-item>
      <el-form-item label="上级组织" prop="parentDepartment">
        <el-input
          v-model="ruleForm.parentDepartment"
          style="width:500px"
          disabled
          placeholder="请输入上级组织"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="ruleForm.note" type="textarea" style="width:500px" placeholder="请输入备注信息"></el-input>
      </el-form-item>
      <el-form-item label="组织地址信息" prop="region">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          style="margin-bottom:20px;"
          @click="addAddress"
        >增加</el-button>
        <el-table :data="addressInfoData" size="mini" border style="width: 100%,margin-top:30px;">
          <el-table-column prop="province" label="省/直辖市"></el-table-column>
          <el-table-column prop="city" label="市/区"></el-table-column>
          <el-table-column prop="postcode" label="邮政编码"></el-table-column>
          <el-table-column prop="address" label="详细地址"></el-table-column>

          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteAddress(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="组织联系人信息" prop="region">
        <el-button
          type="primary"
          size="mini"
          style="margin-bottom:20px;"
          icon="el-icon-plus"
          @click="addContact"
        >增加</el-button>
        <el-table :data="contactInfoData" size="mini" border style="width: 100%,margin-top:30px;">
          <el-table-column prop="name" width="180" label="姓名"></el-table-column>
          <el-table-column prop="telephone" label="电话"></el-table-column>
          <el-table-column prop="email" width="180" label="邮箱"></el-table-column>
          <el-table-column prop="wechat" label="微信"></el-table-column>
          <el-table-column prop="identity_verbosename" label="职能"></el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteContact(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item class="formButtonbox">
        <el-button @click="resetForm('ruleForm')" type="warning" size="mini">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="添加联系人信息" :visible.sync="dialogContactVisible">
      <el-form
        :model="contactform"
        size="mini"
        :rules="contactfromrules"
        ref="contactform"
        label-width="80px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="contactform.email" auto-complete="off" @blur="getContactInfo()"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="contactform.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="contactform.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职能" prop="identity">
          <el-select v-model="contactform.identity" placeholder="请选择">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="contactform.wechat" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="contactform.comment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="resetContactForm('contactform')" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitContactForm('contactform')" size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加组织地址信息" :visible.sync="dialogAddressVisible">
      <el-form
        :model="addressForm"
        label-width="100px"
        :rules="addressFormrules"
        ref="addressForm"
        size="mini"
      >
        <el-form-item label="省/直辖市" prop="province">
          <el-select
            v-model="addressForm.province"
            @change="getCity(),getAddressInfo()"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in provinces"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市/区" prop="city">
          <el-select v-model="addressForm.city" @change="getAddressInfo()" placeholder="请选择">
            <el-option
              v-for="(item,index) in cities"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address" auto-complete="off" @blur="getAddressInfo()"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postcode">
          <el-input v-model="addressForm.postcode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addressForm.comment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="resetAddressForm('addressForm')" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitAddressForm('addressForm')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { toMyStr } from "../../../until/index.js";
import { toMyTime,messageTip } from "../../../until/index.js";
export default {
  name: "",
  components: {},
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱地址"));
      } else {
        var emailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (!emailReg.test(value)) {
          callback(new Error("请输入正确的邮箱地址"));
        }
        callback();
      }
    };
    var validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话"));
      } else {
        var telReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!telReg.test(value)) {
          callback(new Error("请输入正确格式的电话号码"));
        }

        callback();
      }
    };

    return {
      href: ManageIndex,
      ruleForm: {
        departmentName: "",
        parentDepartment: "",
        note: ""
      },

      rules: {
        departmentName: [
          { required: true, message: "请输入组织名称", trigger: "blur" }
        ],
        parentDepartment: [
          { required: false, message: "请输入上级组织名称", trigger: "blur" }
        ]
      },
      contactInfoData: [], //联系人信息
      addressData: [], //网段地址信息
      broadBandData: [], //宽带信息
      exportData: [], //出口信息
      addressInfoData: [], //组织地址信息
      dialogContactVisible: false, //联系人弹窗
      dialogAddressVisible: false, //组织地址
      options: [
        {
          value: "admin",
          label: "管理员"
        },
        {
          value: "user",
          label: "普通用户"
        }
      ],
      contactform: {
        name: "",
        email: "",
        telephone: "",
        wechat: "",
        identity: "user",
        identity_verbosename: "普通用户",
        comment: ""
      },

      contactfromrules: {
        name: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入联系邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: validateTel, trigger: "blur" }
        ],
        function: [{ required: true, message: "请选择职能", trigger: "change" }]
      },
      provinces: [],
      cities: [],
      addressForm: {
        province: "",
        city: "",
        postcode: "",
        address: "",
        comment: ""
      },
      addressFormrules: {
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getProvince();
    this.getDetail();
  },
  methods: {
    handleDeleteContact(index, row) {
      this.$confirm(
        "此操作将永久删除该联系人, 是否继续?（点击提交按钮生效）",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.contactInfoData.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    addContact() {
      this.dialogContactVisible = true;
    },
    submitContactForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addContactForm();
        } else {
          return false;
        }
      });
    },
    resetContactForm(formName) {
      this.dialogContactVisible = false;
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addWork();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      window.history.go(-1)
    },
    addWork() {
      this.$put({
        url: HP1 + "/terminal/organization/v1",
        data: {
          id: Number(this.$route.query.id),
          name: this.ruleForm.departmentName,
          comment: this.ruleForm.note,
          addresses: this.addressInfoData,
          networks: this.addressData,
          contacts: this.contactInfoData,
          broadbands: this.broadBandData,
          exports: this.exportData
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.$router.push({
            path: "workInfoManage"
          });
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    addContactForm() {
      let identity_verbosename;
      let contactformObj = {};
      if (this.contactform.identity == "user") {
        identity_verbosename = "普通用户";
      } else {
        identity_verbosename = "管理员";
      }
      contactformObj = Object.assign({}, this.contactform, {
        identity_verbosename: identity_verbosename
      });
      this.contactInfoData.push(contactformObj);
      this.dialogContactVisible = false;
      this.contactform = {
        name: "",
        email: "",
        telephone: "",
        wechat: "",
        identity: "user",
        identity_verbosename: "普通用户",
        comment: ""
      };
    },

    getProvince() {
      this.$get({
        url: HP1 + "/terminal/common/provinces/v1",
        data: {}
      }).then(res => {
        if (res.data.code == 200) {
          res.data.info.forEach((item, index) => {
            this.provinces.push({
              value: item,
              label: item
            });
          });
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getCity() {
      this.addressForm.city = "";
      this.$post({
        url: HP1 + "/terminal/common/cities/v1",
        data: {
          provinces: this.addressForm.province.split(" ")
        }
      }).then(res => {
        this.cities = [];
        if (res.data.code == 200) {
          res.data.info.forEach((item, index) => {
            this.cities.push({
              value: item,
              label: item
            });
          });
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getDetail() {
      this.$get({
        url: HP1 + "/terminal/organization/v1",
        data: {
          id: this.$route.query.id
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.ruleForm.departmentName = res.data.info.organization.name;
          this.ruleForm.parentDepartment = res.data.info.organization.parent;
          this.ruleForm.note = res.data.info.organization.comment;
          this.addressInfoData = res.data.info.addresses;
          this.addressData = res.data.info.networks;
          this.contactInfoData = res.data.info.contacts;
          this.broadBandData = res.data.info.broadbands;
          this.exportData = res.data.info.exports;
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    addAddress() {
      this.addressForm = {
        province: "",
        city: "",
        postcode: "",
        address: "",
        comment: ""
      }
      this.dialogAddressVisible = true;
    },
    addAddressForm() {
      let codeReg = /^[0-9][0-9]{5}$/; //邮政编码正则
      if (
        this.addressForm.postcode != "" &&
        !codeReg.test(this.addressForm.postcode)
      ) {
        this.$message({
          type: "error",
          message: "请输入正确格式的邮政编码"
        });
        return false;
      }
      this.addressInfoData.push({
        ...this.addressForm
      });
      this.dialogAddressVisible = false;
    },
    submitAddressForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addAddressForm();
        } else {
          return false;
        }
      });
    },
    resetAddressForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogAddressVisible = false;
    },
    handleDeleteAddress(index, row) {
      this.$confirm(
        "此操作将永久删除地址信息, 是否继续?（点击提交按钮生效）",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
         this.addressInfoData.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      
    },
    getAddressInfo() {
      this.$get({
        url: HP1 + "/terminal/organization/address/v1",
        data: {
          province: this.addressForm.province,
          city: this.addressForm.city,
          address: this.addressForm.address
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.addressForm.postcode =
            res.data.info.postcode == null ? "" : res.data.info.postcode;
          this.addressForm.comment =
            res.data.info.comment == null ? "" : res.data.info.comment;
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getContactInfo() {
      this.$get({
        url: HP1 + "/terminal/organization/contact/v1",
        data: {
          email: this.contactform.email
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.contactform.name =
            res.data.info.name == null ? "" : res.data.info.name;
          this.contactform.email =
            res.data.info.email == null ? "" : res.data.info.email;
          this.contactform.telephone =
            res.data.info.telephone == null ? "" : res.data.info.telephone;
          this.contactform.wechat =
            res.data.info.wechat == null ? "" : res.data.info.wechat;
          this.contactform.identity = res.data.info.identity;
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
<style scoped>
</style>

