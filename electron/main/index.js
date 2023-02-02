// app 控制应用程序的事件生命周期（相当于应用程序）
// BrowserWindow 创建并控制浏览器窗口（相当于打开桌面弹框）
import { app, BrowserWindow } from "electron";
import { join } from "node:path";

// 定义全局变量，获取窗口实例
let win;

/**
 * 创建一个窗口
 */
const createWindow = () => {
  win = new BrowserWindow({
    width: 900,
    height: 550,
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      // preload: join(__dirname, "../preload/index.js"),
      // 集成网页和 Node.js，也就是在渲染进程中，可以调用 Node.js 方法
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // 解决浏览器跨域的问题
    },
  });

  // 集成网页和 Node.js 后，需要加载
  // 这里接收的网址是指：Vite 启动后，会在本地运行一个服务，把这个服务网址丢进去就行
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    // 这是关键点，加载静态index.html文件
    win.loadURL("file://" + join(__dirname, "../dist/index.html"));
  }
};

// 初始化app（在 Electron 完成初始化时触发），挂载上面创建的 桌面应用程序窗口
app.whenReady().then(createWindow);
