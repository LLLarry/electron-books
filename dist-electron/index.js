"use strict";const o=require("electron"),n=require("node:path");let e;const t=()=>{e=new o.BrowserWindow({width:900,height:550,title:"Main window",icon:n.join(process.env.PUBLIC,"favicon.ico"),webPreferences:{nodeIntegration:!0,contextIsolation:!1,webSecurity:!1}}),process.env.VITE_DEV_SERVER_URL?(e.loadURL(process.env.VITE_DEV_SERVER_URL),e.webContents.openDevTools()):e.loadURL("file://"+n.join(__dirname,"../dist/index.html"))};o.app.whenReady().then(t);
