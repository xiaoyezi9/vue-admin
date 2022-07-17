<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" @clear="getUserInfo" v-model="queryInfo.query" clearable>
            <template #append>
              <el-button :icon="Search" @click="getUserInfo" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="state.userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="width"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="width"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="width"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="width"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="width">
          <template #default="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" :icon="Delete" @click="deleteUserById(scope.row.id)"></el-button>
            <el-button type="warning" :icon="Setting" @click="setRole(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="demo-pagination-block">
        <el-pagination :page-sizes="[1, 2, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :page-size="queryInfo.pagesize" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog @close="addCloseDialog" v-model="dialogVisible" title="添加用户" width="30%" :before-close="handleClose">
      <el-form ref="addFormRef" :model="addForm" :rules="addFromRules" label-width="70px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="add">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog @close="editCloseDialog" v-model="editDialogVisible" title="修改用户" width="30%">
      <el-form ref="editFormRef" :model="state.editForm" :rules="editRules" label-width="70px" status-icon>
        <el-form-item label="用户名">
          <el-input v-model="state.editForm.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="state.editForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="state.editForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="edit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog v-model="setdialogVisible" title="分配角色" width="30%" @close="handleClose">
      <div>
        <p>用户：{{state.Info.username}}</p>
        <p>角色: {{state.Info.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="state.selectedRoleId" placeholder="请选择" :teleported="false">
            <el-option v-for="item in state.rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setdialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup >
import { Search, Delete, Edit, Setting } from "@element-plus/icons-vue";
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "用户管理", path: undefined },
  { text: "用户列表", path: undefined },
]);
const { proxy: that } = getCurrentInstance();
//获取用户列表信息
let queryInfo = reactive({
  query: "",
  pagenum: 1,
  pagesize: 2,
});
let total = ref(0);
const state = reactive({
  userList: [],
  userInfo: {},
  editForm: {},
  Info: {},
  rolesList: [],
  selectedRoleId: "",
});
async function getUserInfo() {
  let result = await that.$API.reqUserInfo(queryInfo);
  if (result.meta.status == 200) {
    state.userList = result.data.users;
    total.value = result.data.total;
  } else {
    ElMessage.error("获取失败");
    // console.log(decodeURI('https://lianghj.top:8888/api/private/v1/users?params=%7B%22query%22:%22%22,%22pagenum%22:1,%22pagesize%22:2%7D'));
  }
}
function handleSizeChange(newSize) {
  queryInfo.pagesize = newSize;
  getUserInfo();
}
const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage;
  getUserInfo();
};
//更新用户状态
const changeStatus = async (userInfo) => {
  let result = await that.$API.reqUserStatus(userInfo);
  if (result.meta.status == 200) {
    ElMessage({
      message: "更新成功",
      type: "success",
    });
  } else {
    //保证页面不发生改变
    userInfo.mg_state = !userInfo.mg_state;
    ElMessage.error("更新用户状态失败");
  }
};
//添加用户相关操作
let addForm = reactive({
  username: "",
  password: "",
  email: "",
  mobile: "",
});
let dialogVisible = ref(false);
//关闭对话框后清空内容
const addFormRef = ref(null);
const addCloseDialog = () => {
  addFormRef.value.resetFields();
};
const add = () => {
  //添加前的校验
  addFormRef.value.validate(async (valid) => {
    if (!valid) return;
    //校验成功添加用户
    try {
      await that.$API.reqUser(addForm);
      ElMessage({
        message: "添加成功",
        type: "success",
      });
      dialogVisible.value = false;
      getUserInfo();
    } catch (e) {
      ElMessage.error("添加失败");
    }
  });
};
//修改
let editDialogVisible = ref(false);
const showEditDialog = async (id) => {
  const result = await that.$API.reqUserId(id);
  if (result.meta.status == 200) {
    state.editForm = result.data;
    editDialogVisible.value = true;
  } else {
    ElMessage.error("查询失败");
  }
};
const editFormRef = ref(null);
const editCloseDialog = () => {
  editFormRef.value.resetFields();
};
const edit = () => {
  editFormRef.value.validate(async (valid) => {
    if (!valid) return;
    const result = await that.$API.editUserId(state.editForm.id, {
      email: state.editForm.email,
      mobile: state.editForm.mobile,
    });
    if (result.meta.status == 200) {
      editDialogVisible.value = false;
      getUserInfo();
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    }
  });
};
//删除
const deleteUserById = (id) => {
  ElMessageBox.confirm("确定删除吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await that.$API.delUserId(id);
      if (res.meta.status == 200) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      }
      getUserInfo();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};
const setdialogVisible = ref(false);
const setRole = async (user) => {
  state.Info = user;
  setdialogVisible.value = true;
  const res = await that.$API.reqRolesList();
  if (res.meta.status == 200) {
    state.rolesList = res.data;
  }
};

const saveRole = async () => {
  if (!state.selectedRoleId) return ElMessage.error("请选择要分配的角色");
  const res = await that.$API.reqSetRole(state.Info.id, {
    rid: state.selectedRoleId,
  });
  if (res.meta.status == 200) {
    ElMessage.success("分配成功");
    getUserInfo();
  } else {
    ElMessage.error("分配失败");
  }
};
const handleClose = () => {
  state.selectedRoleId = "";
  state.Info = {};
};
// 表单验证
// 自定义规则
const checkEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("邮箱不能为空"));
  }
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+([a-zA-Z0-9_-])/;
  if (regEmail.test(value)) {
    return callback();
  }
  callback(new Error("请输入合法的邮箱"));
};
const checkmobile = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("手机号不能为空"));
  }
  const regmobile = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
  if (regmobile.test(value)) {
    return callback();
  }
  callback(new Error("请输入合法的手机号"));
};
const addFromRules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    { validator: checkEmail, trigger: "blur" },
  ],
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
    { validator: checkmobile, trigger: "blur" },
  ],
});

const editRules = reactive({
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: checkEmail, trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: checkmobile, trigger: "blur" },
  ],
});
const addUser = () => {
  dialogVisible.value = true;
};

onMounted(() => {
  getUserInfo();
});
</script>
<script>
export default {
  name: "user",
};
</script>
 
<style lang='less' scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>