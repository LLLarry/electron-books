<template>
  <div class="book" ref="bookEle">
    <a-card :bordered="true">
      <template #title>
        <div class="title-box">
          <h4 v-if="book">
            {{ book.metadata && book.metadata.title }}

            <span>（{{ book.metadata && book.metadata.creator }}）</span>
          </h4>

          <a-button type="primary" @click="$router.go(-1)">
            <template #icon><DoubleLeftOutlined /></template>
            返回上一页</a-button
          >
        </div>
      </template>
      <template #extra>
        <div class="extra-box">
          <MenuFoldOutlined v-if="showMenu" @click="showMenu = false" />
          <MenuUnfoldOutlined v-else @click="showMenu = true" />
        </div>
      </template>
      <div class="list">
        <div class="left" :style="[!showMenu && 'width: 0']">
          <a-menu
            id="dddddd"
            style="width: 100%"
            mode="inline"
            @click="handlerClick"
            v-model:selectedKeys="selectedKeys"
          >
            <a-menu-item v-for="item in toc" :key="item.id">
              <span>{{ item.title }}</span>
            </a-menu-item>
          </a-menu>
        </div>
        <div class="right" ref="rightEle" v-html="renderHtml"></div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import {
  DoubleLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import parseEpub from "../../utils/parse-epub";
const cheerio = require("cheerio");
const path = require("path");
const route = useRoute();
const book = ref(null);
const renderHtml = ref("");
const bookEle = ref(null);
const rightEle = ref(null);
const selectedKeys = ref([]);
const showMenu = ref(true);

const bookDir = import.meta.env.VITE_APP_DOWNLOAD_DIR;
const p = path.resolve(bookDir, route.query.filename);
const toc = computed(() => (book.value && book.value.toc) || []);

onMounted(() => {
  parseEpub(p).then((epub) => {
    console.log(epub);
    book.value = epub;
    selectedKeys.value = [toc.value[0].id];
    handlerClick({ key: toc.value[0].id });
    // 加载对应的css，添加上去
    epub.getFile(
      (epub.manifest.css || epub.manifest["style.css"] || {}).id,
      (error, data, mineType) => {
        if (error) return;
        const style = document.createElement("style");
        style.innerHTML = data.toString();
        bookEle.value.appendChild(style);
      }
    );
  });
});

const handlerClick = ({ key }) => {
  if (!book.value) return;
  if (rightEle.value) {
    rightEle.value.scrollTop = 0;
  }
  book.value.getChapter(key, (error, text) => {
    // console.log(error, text);
    if (error) return;

    // 加载对应的图片、然后在book中找到对应的图片进行替换
    const $ = cheerio.load(text);
    $("img").each((index, el) => {
      const idsReg = /^\/images\/(.+?)$/; // const idsReg = /images\/(.+?)\/images/;
      const result = idsReg.exec(el.attribs.src || "");
      let s;
      if (result) {
        s = result[1];
      } else {
        s = el.attribs.alt;
      }
      console.log("ss", result);
      let t = null;
      for (const [key, one] of Object.entries(book.value.manifest)) {
        if (one.href === s || new RegExp("x" + s, "ig").exec(key)) {
          t = one;
          continue;
        }
      }

      if (!t) return;
      book.value.getImage(t.id, (error, img, mimeType) => {
        if (error) return;
        const s = `data:${mimeType};base64,` + img.toString("base64");
        $(`img`).attr("src", s);
        renderHtml.value = $.html();
      });
      renderHtml.value = $.html();
    });

    renderHtml.value = text;
  });
};
</script>

<style lang="scss" scoped>
.ant-card {
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  &::v-deep(.ant-card-body) {
    flex: 1;
    overflow: hidden;
  }
  .extra-box {
    font-size: 28px;
    color: cadetblue;
    cursor: pointer;
  }
}
.title-box {
  display: flex;
  align-items: center;
  h4 {
    margin: 0;
    margin-right: 20px;
    span {
      font-size: 14px;
      color: #666;
      font-weight: 400;
    }
  }
}
.list {
  display: flex;
  height: 100%;
  .left {
    height: 100%;
    width: 265px;
    overflow-y: auto;
    transition: width 0.4s ease;
  }
  .right {
    height: 100%;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
  }
}
@media screen and (max-width: 800px) {
  .book .ant-card .left {
    width: 180px !important;
  }
}
</style>
