<template>
  <div id="app">
    <el-config-provider :locale="zhCn">
    <router-view></router-view>
    </el-config-provider>
  </div>
</template>


<script setup>
import { ElConfigProvider } from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
</script>
<script>
export default {
  name: "App",
}
</script>
<style>
</style>
 