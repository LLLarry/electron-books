<script setup>
const fs = require("fs");
const path = require("path");
// // fs.readFile(path.resolve(__dirname, "../index.html"));
// console.log(fs.readdir(path.resolve(__dirname, "../../")));
</script>

<template>
  <router-view></router-view>
</template>

<style>
body {
  margin: 0 !important;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #e5e5e5;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}
</style>
