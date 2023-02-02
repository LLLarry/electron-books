import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
// import axios from "axios";
import "./style.css";
import "ant-design-vue/dist/antd.css";

const app = createApp(App)
  .use(router)
  .use(Antd)
  .mount("#app");
// app.config.globalProperties.$http = axios;
