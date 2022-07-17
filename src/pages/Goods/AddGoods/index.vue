<template>
  <!-- 面包屑 -->
  <Breadcrumb :breadList="breadList"></Breadcrumb>
  <el-card>
    <el-alert title="添加商品信息" type="info " center show-icon :closable="false"></el-alert>
    <el-steps :space="200" :active="activeIndex" finish-status="success" align-center>
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
    <el-form ref="addFormRef" :model="addForm" :rules="rules" label-width="120px" class="demo-ruleForm" label-position="top" status-icon>
      <el-tabs v-model="activeIndex" tab-position="left" class="demo-tabs" :before-leave="beforeTabLeave" @tab-click="tabClick">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader v-model="addForm.goods_cat" :options="state.cateList" :props="state.config" @change="handleChange" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="(item,index) in state.manyData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,index2) in item.attr_vals" :key="index2" />
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in state.onlyData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload class="upload-demo" action="https://lianghj.top:8888/api/private/v1/upload" :on-preview="handlePreview" :headers="headerObj" :on-remove="handleRemove" list-type="picture-card" :on-success="handleSuccess">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <QuillEditor theme="snow" ref="qe"></QuillEditor>
          <el-button type="primary" class="btns" @click="commit">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- 图片预览对话框 -->
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup >
import { useRouter } from "vue-router";
import _ from "lodash";
import { ref, reactive, onMounted, getCurrentInstance, computed } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "商品管理", path: undefined },
  { text: "添加商品", path: undefined },
]);
const activeIndex = ref("0");
const state = reactive({
  cateList: [],
  //级联选择器配置项
  config: {
    label: "cat_name",
    value: "cat_id",
    children: "children",
    expandTrigger: "hover",
  },
  manyData: [],
  onlyData: [],
});
//图片上传请求透，--因为该请求不会经过我们配置好的axios
const headerObj = reactive({
  Authorization: sessionStorage.getItem("token"),
});
const addForm = reactive({
  goods_name: "",
  goods_price: 0,
  goods_weight: 0,
  goods_number: 0,
  goods_cat: [],
  pics: [],
  goods_introduce: "",
  attrs: [],
});
const rules = reactive({
  goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
  goods_weight: [
    { required: true, message: "请输入商品重量", trigger: "blur" },
  ],
  goods_number: [
    { required: true, message: "请输入商品数量", trigger: "blur" },
  ],
  goods_cat: [{ required: true, message: "请选择", trigger: "blur" }],
});
//级联选择器发生变化时触发
function handleChange() {
  if (addForm.goods_cat.length !== 3) {
    addForm.goods_cat = [];
  }
}
//标签页切换时触发
function beforeTabLeave(activeName, oldActiveName) {
  if (oldActiveName == "0" && addForm.goods_cat.length !== 3) {
    ElMessage.error("请先选择商品分类");
    return false;
  }
  return true;
}
//标签页点击时触发
const tabClick = async () => {
  //console.log(activeIndex.value);
  if (activeIndex.value == "1") {
    const res = await that.$API.reqAttr(cateId.value, { sel: "many" });
    if (res.meta.status == 200) {
      ElMessage.success("获取动态参数成功");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      });
      state.manyData = res.data;
    } else {
      ElMessage.error("获取动态参数失败");
    }
  } else if (activeIndex.value == "2") {
    const res = await that.$API.reqAttr(cateId.value, { sel: "only" });
    if (res.meta.status == 200) {
      ElMessage.success("获取静态参数成功");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      });
      state.onlyData = res.data;
    } else {
      ElMessage.error("获取静态参数失败");
    }
  }
};
//图片预览
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handlePreview = (uploadFile) => {
  console.log(uploadFile);
  dialogImageUrl.value = uploadFile.response.data.url;
  dialogVisible.value = true;
};
const handleRemove = (file) => {
  const path = file.response.data.tmp_path;
  const index = addForm.pics.findIndex((x) => {
    return x.pic == path;
  });
  addForm.pics.splice(index, 1);
};

function handleSuccess(response) {
  //拼接一个图片信息对象
  const info = { pic: response.data.tmp_path };
  addForm.pics.push(info);
}
const router = useRouter();
const qe = ref(null);
const commit = async () => {
  if (addForm.value !== null) {
    const form = _.cloneDeep(addForm);
    form.goods_cat = form.goods_cat.join(",");
    if (qe.value !== null) {
      form.goods_introduce = qe.value.getContents().ops[0].insert;
    }
    const res = await that.$API.addGoods(form);
    if (res.meta.status !== 201) {
      ElMessage.error("添加商品失败");
    }
    ElMessage.success("添加商品成功");
    router.push("/goods");
  }
};
const cateId = computed(() => {
  if (addForm.goods_cat.length == 3) {
    return addForm.goods_cat[2];
  }
  return null;
});
const { proxy: that } = getCurrentInstance();

const getCateList = async () => {
  const res = await that.$API.reqCateList();
  if (res.meta.status == 200) {
    state.cateList = res.data;
  } else {
    ElMessage.error("获取失败");
  }
};

onMounted(() => {
  getCateList();
});
</script>

<script>
export default {
  name: "AddGoods",
};
</script>
<style lang='less'>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin-bottom: 10px;
}
</style>