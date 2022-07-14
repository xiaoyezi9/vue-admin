import { createApp } from "vue";
import '@/assets/css/global.css'
import { ElMessage, ElMessageBox } from 'element-plus';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import App from "./App.vue";
import router from '@/router';
import * as API from '@/api'
const app=createApp(App);
app.config.globalProperties.$API=API
app.use(router)
app.use(ElMessage)
app.use(ElMessageBox).mount("#app");