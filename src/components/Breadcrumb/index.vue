<template>
<!-- 面包屑 -->
  <el-breadcrumb :separator-icon="ArrowRight" >
    <el-breadcrumb-item :to="{ path: bread.path }" v-for="(bread,index) in props.breadList" :key="index">{{bread.text}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup >
import { ArrowRight } from '@element-plus/icons-vue'
const props=defineProps(['breadList'])
</script>
<script>
export default {
  name: "Breadcrumb",
};
</script>
<style lang='less' scoped>
</style>