<template>
  <Breadcrumb :breadList="breadList"></Breadcrumb>
  <el-card>
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script setup >
import * as echarts from "echarts";
import _ from 'lodash'
import { ref, reactive, onMounted, getCurrentInstance, computed } from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "数据统计", path: undefined },
  { text: "数据报表", path: undefined },
]);
  // 指定图表的配置项和数据
let option = reactive({
  title: {
    text: "用户来源",
  },
  tooltip: {
    trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
  },
   grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [   { boundaryGap: false  } ],
        yAxis: [  {  type: 'value'  }  ]
      
})
 const {proxy:that} =getCurrentInstance()
onMounted(async() => {
  //实例化echars实例
  let myChart = echarts.init(document.getElementById("main"));
  //准备数据和配置项
  const res =await that.$API.reqReport()
  if(res.meta.status==200){
    ElMessage.success('获取成功')
  }else{
    ElMessage.error('数据获取失败')
  }

// 使用刚指定的配置项和数据显示图
myChart.setOption(_.merge(res.data,option));

});

</script>

<script>
export default {
  name: "Echars",
};
</script>
<style lang='less' scoped>
</style>