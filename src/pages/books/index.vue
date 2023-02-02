<template>
  <div class="books">
    <a-card :bordered="true">
      <template #title>
        <div class="title-box">
          <h4>已下载的书籍</h4>
          <a-button type="primary" @click="$router.go(-1)">
            <template #icon><DoubleLeftOutlined /></template>
            返回上一页</a-button
          >
        </div>
      </template>
    </a-card>

    <div class="books-container">
      <a-card
        hoverable
        v-for="(book, index) in books"
        :key="index"
        @click="handlerGo(book)"
      >
        <template #cover>
          <img
            alt="example"
            :src="
              book.coverUrl ||
              'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
            "
          />
        </template>

        <a-card-meta :title="book.metadata.title">
          <template #description>
            <div class="creator">
              {{ book.metadata.creator }}
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { DoubleLeftOutlined } from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";
import parseEpub from "../../utils/parse-epub";
import { useRouter } from "vue-router";
const router = useRouter();

const fs = require("fs");
const path = require("path");
const bookDir = import.meta.env.VITE_APP_DOWNLOAD_DIR;
const books = ref([]);
fs.readdir(bookDir, async (err, files) => {
  if (err) {
    console.log(err);
  } else {
    for (const [index, file] of Object.entries(files)) {
      const p = path.resolve(bookDir, file);
      try {
        const epub = await parseEpub(p);
        epub.getImage(epub.metadata.cover, function (error, img, mimeType) {
          console.log(error, img, mimeType);
          let coverUrl = null;
          if (img) {
            coverUrl = `data:${mimeType};base64,` + img.toString("base64");
          }

          epub.coverUrl = coverUrl;
          epub.file = file;
          books.value.push(epub);
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  }
});

const handlerGo = (book) => {
  router.push({ path: "/book", query: { filename: book.file } });
};
</script>

<style lang="scss" scoped>
.title-box {
  display: flex;
  align-items: center;
  h4 {
    margin: 0;
    margin-right: 20px;
  }
}
.books-container {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  .ant-card {
    max-width: 260px;
    min-width: 160px;
    width: 33.333%;
    margin-right: 20px;
    margin-bottom: 20px;
    img {
      aspect-ratio: 1/1.4;
    }
  }
  .creator {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
}
</style>
