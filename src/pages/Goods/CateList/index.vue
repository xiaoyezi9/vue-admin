<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" @clear="getGoodsInfo" v-model="queryInfo.query" clearable>
            <template #append>
              <el-button :icon="Search" @click="getGoodsInfo" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="state.goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="width"></el-table-column>
        <el-table-column prop="goods_number" label="商品重量" width="width"></el-table-column>
        <el-table-column  label="创建时间" width="width">
                    <template #default='scope'>
                       {{date(scope.row.add_time).value}}
                    </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" @click="showEditDialog(scope.row.goods_id)"></el-button>
            <el-button type="danger" :icon="Delete" @click="deleteGoodsById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="demo-pagination-block">
        <el-pagination :page-sizes="[1, 2, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :page-size="queryInfo.pagesize" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

  </div>
</template>

<script setup >
import { Search, Delete, Edit, Setting } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { reactive, ref, onMounted, getCurrentInstance,computed } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "商品管理", path: undefined },
  { text: "商品列表", path: undefined },
]);
const { proxy: that } = getCurrentInstance();
//获取商品列表信息
let queryInfo = reactive({
  query: "",
  pagenum: 1,
  pagesize: 2,
});
let total = ref(0);
const state = reactive({

    goodsList:[]
});
//格式化时间

const date=(val) => {
   return  computed(() => {
    const dt =new Date(val)
    const y=dt.getFullYear()
    const m=(dt.getMonth()+1+'').padStart(2,'0')
    const d=(dt.getDate()+'').padStart(2,'0')
    const hh=(dt.getHours()+'').padStart(2,'0')
    const mm=(dt.getMinutes()+'').padStart(2,'0')
    const ss=(dt.getSeconds()+'').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    })
}
//分页器相关操作
function handleSizeChange(newSize) {
  queryInfo.pagesize = newSize;
  getGoodsInfo();
}
const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage;
  getGoodsInfo();
};

//删除
const deleteGoodsById = (id) => {
  ElMessageBox.confirm("确定删除吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
   const res=  await that.$API.delGoodsId(id);
     if(res.meta.status==200){
          ElMessage({
        type: "success",
        message: "删除成功",
      });
     }
      getGoodsInfo();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};
   const router = useRouter();
function goAddPage(){
    router.push('/goods/add')
}
//获取商品信息
async function getGoodsInfo() {
  let result = await that.$API.reqGoodsInfo(queryInfo);
  if (result.meta.status == 200) {
    state.goodsList = result.data.goods;
    total.value = result.data.total;
  } else {
    ElMessage.error("获取失败");
  
  }
}
onMounted(() => {
  getGoodsInfo();
});
</script>
<script>
export default {
  name: "CateList",
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