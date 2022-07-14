<template>
    <div>
<el-button type="info" @click='logout'>退出</el-button>
    </div>
</template>

<script setup >
import { useRouter } from "vue-router";
const router=useRouter()
const logout=() => {
    sessionStorage.clear()
    router.push('/login')
}
</script>

<style lang='less' scoped>

</style>