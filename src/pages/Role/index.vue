<template>
  <!-- 面包屑 -->
  <Breadcrumb :breadList="breadList"></Breadcrumb>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-button type="primary" @click="addRoles">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="state.roleList" style="width: 100%" row-key="id">
      <el-table-column type="expand">
        <template #default="scope">
          <el-row :class="['bdbottom',index===0?'bdtop':'','vcenter']" v-for="(item, index) in scope.row.children" :key="index">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag>{{item.authName}}</el-tag>
              <el-icon>
                <CaretRight />
              </el-icon>
            </el-col>
            <!-- 二级和三级 -->
            <el-col :span="19">
              <el-row :class="[index2===0?'':'bdtop','vcenter']" v-for="(item2,index2) in item.children" :key="index2">
                <el-col :span="6">
                  <el-tag type="success">{{item2.authName}}</el-tag>
                  <el-icon>
                    <CaretRight />
                  </el-icon>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" @close="removeTagById(scope.row,item3.id)" closable v-for="(item3, index3) in item2.children" :key="index3">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="width"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="width"></el-table-column>
      <el-table-column label="操作" width="width">
        <template #default="scope">
          <el-button type="primary" :icon="Edit">编辑</el-button>
          <el-button type="danger" :icon="Delete">删除</el-button>
          <el-button type="warning" :icon="Setting" @click="assginPower(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分配权限对话框 -->
  <el-dialog @close="CloseDialog" v-model="dialogVisible" title="分配权限" width="30%">
    <el-tree :data="state.powerList" ref="treeRef" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="state.defKeys"></el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup >
import { CaretRight } from "@element-plus/icons-vue";
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "权限管理", path: undefined },
  { text: "角色列表", path: undefined },
]);
const state = reactive({
  roleList: [],
  powerList: [],
  defKeys: [],
  roleId: "",
});
const { proxy: that } = getCurrentInstance();
const getRolesList = async () => {
  const result = await that.$API.reqRolesList();
  if (result.meta.status == 200) {
    state.roleList = result.data;
  }
};
const removeTagById = async (role, powerId) => {
  const result = await that.$API.delRolePower(role.id, powerId);
  if (result.meta.status == 200) {
    role.children = result.data;
    // getRolesList()
  }
};
const CloseDialog = () => {
  state.defKeys = [];
};
const treeProps = {
  label: "authName",
  children: "children",
};
const dialogVisible = ref(false);
//通过递归的方式，获取角色所有三级权限id并保存再defKeys中
const getLeafKeys = (node, arr) => {
  //只有三级权限没有children
  if (!node.children) return arr.push(node.id);
  node.children.forEach((item) => {
    getLeafKeys(item, arr);
  });
};
const assginPower = async (role) => {
  const res = await that.$API.reqGetAllPower("tree");
  if (res.meta.status == 200) {
    state.powerList = res.data;
  }
  dialogVisible.value = true;
  getLeafKeys(role, state.defKeys);
  state.roleId = role.id;
};

const treeRef = ref(null);
//分配权限
const confirm = async () => {
  const keys = [
    ...treeRef.value.getCheckedKeys(),
    ...treeRef.value.getHalfCheckedKeys(),
  ];
  const rids= keys.join(",");
  
  const res = await that.$API.reqsetPower(state.roleId,{rids});
  if (res.meta.status == 200) {
    ElMessage({
      type: "success",
      message: "分配成功",
    });
  }
  getRolesList();
  dialogVisible.value = false;
};
const addRoles = () => {};
onMounted(() => {
  getRolesList();
});
</script>
<script>
export default {
  name: "Role",
};
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>