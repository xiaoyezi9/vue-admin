<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~@/assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :prefix-icon="Avatar" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" :prefix-icon="Lock" placeholder="请输入密码" type="password" />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="el-form-item__content">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Avatar, Lock } from "@element-plus/icons-vue";
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const loginForm = reactive({
      username: "admin",
      password: "123456",
    });
    const loginFormRules = reactive({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
      ],
    });
    // 获取实例
    const loginFormRef = ref(null);
    const { proxy: that } = getCurrentInstance();
    //登录方法
    const login = () => {
      loginFormRef.value.validate(async (valid) => {
        if (!valid) return;
        const result = await that.$API.reqLogin(loginForm);
        if (result.meta.status == 200) {
          ElMessage({
            message: "登陆成功",
            type: "success",
          });
          sessionStorage.setItem('token',result.data.token)
          router.push("/home");
        } else {
           ElMessage.error("登陆失败");
        }
      });
    };
    //重置方法
    const reset = () => {
      loginFormRef.value.resetFields();
    };

    return {
      Avatar,
      Lock,
      loginForm,
      loginFormRules,
      reset,
      loginFormRef,
      login,
      onMounted,
    };
  },
};
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      /deep/ .el-form-item__content {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>