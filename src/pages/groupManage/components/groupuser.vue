<template>
  <el-dialog id="dialog" :title="title" :visible.sync="dialogUserForm">
    <el-form :model="addUserForm" :rules="userFormRules" size="mini">
      <el-form-item label="用户" prop="username" id="addUser">
        <el-input v-model="addUserForm.username" placeholder="请输入用户信息" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-select v-model="addUserForm.roles" multiple value-key="name" placeholder="请选择角色">
          <el-option
            v-for="(item,index) in rolesList"
            :label="$t(item.name)"
            :value="item.name"
            :key="index"
          >
            <el-tooltip class="item" effect="light" :content="item.desc" placement="top-start">
              <span>{{item.name}}</span>
            </el-tooltip>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogUserForm = false" type="warning" size="mini">关闭</el-button>
      <el-button type="primary" @click="submitHandle" size="mini">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { messageTip } from "../../../until/index.js";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      addUserForm: {
        username: "",
        roles: []
      },
      userFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        roles: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      rolesList: [],
      dialogUserForm: false,
      title: "增加成员",
      isEdit: false //是否编辑操作
    };
  },
  mounted() {
    this.getRolesHandle();
  },
  methods: {
    getRolesHandle() {
      this.$get({
        url: HP1 + "/rbac/group/v1",
        data: {}
      }).then(res => {
        if (res.data.code == 200) {
          this.rolesList = res.data.info.roles;
        } else {
          messageTip("error", res.data.message);
        }
      });
    },
    addUserSubmit() {
      let data = { ...this.addUserForm };
      this.$post({
        url: HP1 + "/rbac/group/user/v1",
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success", res.data.message);
          this.dialogUserForm = false;
          this.$emit("update");
        } else {
          messageTip("error", res.data.message);
        }
      });
    },
    getCurrentRoles(name) {
      this.$get({
        url: HP1 + "/rbac/group/user/v1",
        data: {
          username: name
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.addUserForm.roles = [];
          this.addUserForm.username = res.data.info.username;
          res.data.info.roles.forEach((item, index) => {
            this.addUserForm.roles.push(item.name);
          });
        } else {
          messageTip("error", res.data.message);
        }
      });
    },
    editFormHandle() {
      let data = { ...this.addUserForm };
      this.$put({
        url: HP1 + "/rbac/group/user/v1",
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success", res.data.message);
          this.dialogUserForm = false;
          this.$emit("update");
        } else {
          messageTip("error", res.data.message);
        }
      });
    },
    submitHandle() {
      if (this.isEdit) {
        this.editFormHandle();
      } else {
        this.addUserSubmit();
      }
    }
  }
};
</script>
