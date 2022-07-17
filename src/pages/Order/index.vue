<template>
  <Breadcrumb :breadList="breadList"></Breadcrumb>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input placeholder="请输入内容" @clear="getOrderInfo" v-model="queryInfo.query" clearable>
          <template #append>
            <el-button :icon="Search" @click="getOrderInfo" />
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="state.orderList" border stripe>
      <el-table-column type="index" width="width"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
      <el-table-column label="是否付款" width="100">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.pay_status==1">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" width="80">{{send}}</el-table-column>
      <el-table-column label="下单时间" width="250">
        <template #default="scope">{{date(scope.row.create_time).value}}</template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template #default="scope">
          <el-button type="success" :icon="Edit" @click="showProgressBox"></el-button>
          <el-button type="primary" :icon="Location" @click="showDialog"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="demo-pagination-block">
      <el-pagination :page-sizes="[1, 2, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :page-size="queryInfo.pagesize" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 修改地址对话框 -->
    <el-dialog v-model="dialogVisible" title="修改地址" width="30%" @close="closeDialog">
      <el-form ref="addressFormRef" :model="state.addressForm" label-width="80px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="state.cityData" v-model="state.addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="state.addressForm.address2" placeholder></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editOrder">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog v-model="progressVisible" title="物流进度" width="45%" @close="closeProgressDialog">
        <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in state.progressInfo" :key="index" :timestamp="activity.time">{{ activity.context }}</el-timeline-item>
      </el-timeline>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="progressVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup >
import { Search, Edit, Location } from "@element-plus/icons-vue";
import cityData from "@/utils/citydata";
import { ref, reactive, onMounted, getCurrentInstance, computed } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "订单管理", path: undefined },
  { text: "订单列表", path: undefined },
]);
//格式化时间
const date = (val) => {
  return computed(() => {
    const dt = new Date(val);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + "").padStart(2, "0");
    const d = (dt.getDate() + "").padStart(2, "0");
    const hh = (dt.getHours() + "").padStart(2, "0");
    const mm = (dt.getMinutes() + "").padStart(2, "0");
    const ss = (dt.getSeconds() + "").padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  });
};
//获取商品列表信息
let queryInfo = reactive({
  query: "",
  pagenum: 1,
  pagesize: 10,
});
const { proxy: that } = getCurrentInstance();
let total = ref(0);
const state = reactive({
  orderList: [],
  addressForm: {},
  cityData,
  progressInfo: [],
});
let send = computed(() => {
  return state.orderList.is_send == 1 ? "已发货" : "未发货";
});
//分页器相关操作
function handleSizeChange(newSize) {
  queryInfo.pagesize = newSize;
  getOrderInfo();
}
const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage;
  getOrderInfo();
};

let addressFormRef = ref(null);
//关闭前清空对话框内容
const closeDialog = () => {
  addressFormRef.value.resetFields();
};
const closeProgressDialog = () => {
state.progressInfo=[]
};

let progressVisible = ref(false);

const showProgressBox = async () => {
  progressVisible.value = true;
  const res = await that.$API.reqWuLiu();
  if (res.meta.status == 200) {
    state.progressInfo = res.data;
  }
};

const confirm = () => {
  progressVisible.value = false;
};
let dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
};
const editOrder = () => {
  dialogVisible.value = false;
};
//获取商品信息
async function getOrderInfo() {
  let result = await that.$API.reqOrderList(queryInfo);
  if (result.meta.status == 200) {
    state.orderList = result.data.goods;
    total.value = result.data.total;
  } else {
    ElMessage.error("获取失败");
  }
}
onMounted(() => {
  getOrderInfo();
});
</script>

<script>
export default {
  name: "Order",
};
</script>
<style lang='less' scoped>
</style>