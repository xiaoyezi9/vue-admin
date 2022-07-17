<template>
  <!-- 面包屑 -->
  <Breadcrumb :breadList="breadList"></Breadcrumb>
  <el-card >
    <el-table :data="state.powerList" border stripe  >
      <el-table-column type="index"></el-table-column>
      <el-table-column label='权限名称' prop="authName"></el-table-column>
      <el-table-column label='路径' prop="path"></el-table-column>
      <el-table-column label='权限等级' prop="level" width="200px" center>
        <template #default="scope">
        <el-tag v-if="scope.row.level=='0'">{{scope.row.level}}</el-tag>
        <el-tag v-if="scope.row.level=='1'" type="success">{{scope.row.level}}</el-tag>
        <el-tag v-if="scope.row.level=='2'" type="warning">{{scope.row.level}}</el-tag>

        </template>
      </el-table-column>


    </el-table>
  </el-card>
</template>

<script setup >
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "权限管理", path: undefined },
  { text: "权限列表", path: undefined },
]);
const state = reactive({
  powerList: [], //权限
});
const { proxy: that } = getCurrentInstance();

const getpowerList = async () => {
  const result = await that.$API.reqPowerList();
  if (result.meta.status == 200) {
    state.powerList = result.data;
  }
};
onMounted(() => {
  getpowerList();
});
</script>
<script>
export default {
  name: "Power",
};
</script>
<style lang='less' scoped>
.el-tag{
  width: 40px;
}
</style>