import { createApp } from "vue";
import '@/assets/css/global.css'
import { ElMessage, ElMessageBox } from 'element-plus';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import App from "./App.vue";
import router from '@/router';
import * as API from '@/api'
import Breadcrumb from '@/components/Breadcrumb'
const app=createApp(App);
app.config.warnHandler = () => null;
app.config.globalProperties.$API=API
app.component('QuillEditor', QuillEditor)
app.use(router)
app.use(ElMessage)
app.use('Breadcrumb',Breadcrumb)
app.use(ElMessageBox).mount("#app");