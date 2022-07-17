<template>
  <Breadcrumb :breadList="breadList"></Breadcrumb>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addCategory">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 树形数据 -->
    <el-table :data="state.cateList" style="width: 100%" row-key="id" border stripe :tree-props="{ children: 'children', hasChildren: true }">
      <el-table-column label="#" type="index" width="180">
        <template #default="scope">{{ scope.row.index }}</template>
      </el-table-column>
      <el-table-column prop="cat_name" label="分类名称" width="180" />
      <el-table-column prop="cat_deleted" label="是否有效" width="180">
        <template #default="scope">
          <el-icon v-if="scope.row.cat_deleted==true">
            <CircleCheck />
          </el-icon>
          <el-icon v-else>
            <CircleClose />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序" width="180">
        <template #default="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary">编辑</el-button>
          <el-button type="warning">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-sizes="[2, 3, 5, 8]" layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="queryInfo.pagesize" :current-page="queryInfo.pagenum" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </el-card>
  <el-dialog @close="CloseDialog" v-model="DialogVisible" title="添加分类" width="30%">
    <el-form ref="addFormRef" :model="state.addCateForm" label-width="70px">
      <el-form-item label="分类名称">
        <el-input v-model="state.addCateForm.cat_name" />
      </el-form-item>
      <el-form-item label="父类分类">
        <el-cascader v-model="state.selectValue" clearable :options="state.parentCateList" :props="state.configProps" @change="handleChange" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { CircleCheck, CircleClose } from "@element-plus/icons-vue";

import { ref, reactive, onMounted, getCurrentInstance } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "商品管理", path: undefined },
  { text: "商品分类", path: undefined },
]);
const { proxy: that } = getCurrentInstance();
const queryInfo = reactive({
  type: 3,
  pagenum: 1,
  pagesize: 5,
});
const state = reactive({
  cateList: [], //商品分类列表
  addCateForm: {
    cat_pid: 0,
    cat_level: 0,
  },
  parentCateList: [],
  selectValue: [],
  configProps: {
    expandTrigger: "hover",
    value: "cat_id",
    label: "cat_name",
    children: "children",
    checkStrictly: true,
  },
});
let total = ref(0);
const handleSizeChange = (newSize) => {
  queryInfo.pagesize = newSize;
  getCateList();
};
const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage;
  getCateList();
};
let DialogVisible = ref(false);
const addCategory = async () => {
  DialogVisible.value = true;
  const res = await that.$API.reqCateList({ type: 2 });
  if (res.meta.status == 200) {
    state.parentCateList = res.data;
  } else {
    ElMessage.error("获取父级分类失败");
  }
};
const addFormRef = ref(null);
const CloseDialog = () => {
  addFormRef.value.resetFields();
  state.selectValue = [];
  state.addCateForm.cat_pid = 0;
  state.addCateForm.cat_level = 0;
};
const confirm=async() => {
 const res= await that.$API.reqAddCate(state.addCateForm);
if (res.meta.status == 201) {
    ElMessage.success("添加成功");
    getCateList()
  } else {
    ElMessage.error("添加失败");
  }
  DialogVisible.value = false;
}
const handleChange = () => {
  if (state.selectValue.length > 0) {
    state.addCateForm.cat_pid = state.selectValue[state.selectValue.length - 1];
    state.addCateForm.cat_level = state.selectValue.length;
  } else {
    state.addCateForm.cat_pid = 0;
    state.addCateForm.cat_level = 0;
  }
};
const getCateList = async () => {
  const res = await that.$API.reqCateList(queryInfo);
  if (res.meta.status == 200) {
    state.cateList = res.data.result;
    total.value = res.data.total;
  } else {
    ElMessage.error("获取失败");
  }
  for (let i = 0; i < state.cateList.length; i++) {
    state.cateList[i].index = i + 1;
  }
};
onMounted(() => {
  getCateList();
});
</script>
<script>
export default {
  name: "Cate",
};
</script>
<style lang="less" scoped>
</style>
