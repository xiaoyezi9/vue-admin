<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~@/assets/avata.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 侧边栏菜单 -->
        <div class="toggole" @click="toggoleCollapse">|||</div>
        <el-menu router :default-active='activePath' background-color="#545c64" class="el-menu-vertical-demo" text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false">
          <!-- 一级菜单 -->
          <el-sub-menu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template #title>
              <el-icon v-html="iconsObjs[item.id]"></el-icon>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/'+p.path)" :index="'/'+p.path" v-for="(p,index) in item.children" :key="p.id">
              <template #title>
                <el-icon>
                  <Menu />
                </el-icon>
                <span>{{p.authName}}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { Menu as IconMenu, Location, Menu } from "@element-plus/icons-vue";
import { reactive, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { proxy: that } = getCurrentInstance();
const logout = () => {
  sessionStorage.clear();
  router.push("/login");
};
const menuList = reactive([]);
const iconsObjs = reactive({
  125: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M288 320a224 224 0 1 0 448 0 224 224 0 1 0-448 0zm544 608H160a32 32 0 0 1-32-32v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 0 1-32 32z"></path></svg>',
  103: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M512 128 128 447.936V896h255.936V640H640v256h255.936V447.936z"></path></svg>',
  101: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M320 288v-22.336C320 154.688 405.504 64 512 64s192 90.688 192 201.664v22.4h131.072a32 32 0 0 1 31.808 28.8l57.6 576a32 32 0 0 1-31.808 35.2H131.328a32 32 0 0 1-31.808-35.2l57.6-576a32 32 0 0 1 31.808-28.8H320zm64 0h256v-22.336C640 189.248 582.272 128 512 128c-70.272 0-128 61.248-128 137.664v22.4zm-64 64H217.92l-51.2 512h690.56l-51.264-512H704v96a32 32 0 1 1-64 0v-96H384v96a32 32 0 0 1-64 0v-96z"></path></svg>',
  102: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M192 128v768h640V128H192zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32zm160 448h384v64H320v-64zm0-192h192v64H320v-64zm0 384h384v64H320v-64z"></path></svg>',
  145: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M128 896V128h768v768H128zm291.712-327.296 128 102.4 180.16-201.792-47.744-42.624-139.84 156.608-128-102.4-180.16 201.792 47.744 42.624 139.84-156.608zM816 352a48 48 0 1 0-96 0 48 48 0 0 0 96 0z"></path></svg>',
});
const getMenuList = async () => {
  let result = await that.$API.reqMenu();
  if (result.meta.status == 200) {
    menuList.push(...result.data);
  }
};
getMenuList();
//是否折叠侧边栏
let isCollapse = ref(false);
const toggoleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

//保存连接激活状态
let activePath=ref('')
activePath.value=sessionStorage.getItem('activePath')
const saveNavState=(active) => {
   sessionStorage.setItem('activePath',active)
}

</script>
<script>
export default {
  name: "Home",
};
</script>
<style lang='less' >
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-content: center;
  color: #fff;
  font-size: 20px;
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggole {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>