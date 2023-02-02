<template>
  <a-card class="card-container">
    <template #title>
      <a-input-search
        v-model:value="keywords"
        placeholder="请输入要搜索的内容"
        enter-button
        @search="searchBooks"
      />
    </template>
    <!-- 渲染列表 -->
    <a-table
      :columns="columns"
      :data-source="bookList"
      :pagination="false"
      :scroll="{ x: 1500, y: tableScroll.height - 130 }"
    >
      <template v-slot:bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'cover'">
          <a-image :width="100" :src="record.cover" />
        </template>
        <template v-if="column.dataIndex === 'intro'">
          <p class="v-gray">{{ record.intro }}</p>
        </template>
        <template v-if="column.dataIndex === 'handler'">
          <a-button
            type="primary"
            size="small"
            @click.stop="download((index % 9) + 1, 'epub', $event)"
            >epub{{ (index % 9) + 1 }}</a-button
          >
          <!-- <a-button type="primary" size="small">Default</a-button>
          <a-button type="primary" size="small">Dashed</a-button> -->
        </template>
      </template>
    </a-table>
    <!-- 底部分頁 -->
    <div class="page-box">
      <a-pagination
        v-model:current="page"
        :pageSize="limit"
        :total="totalCount"
        show-less-items
        @showSizeChange="showSizeChange"
        @change="pageChange"
      />
    </div>
    <Menu :downingBooks="downingBooks" :downTotalBooks="downTotalBooks" />
  </a-card>
</template>

<script setup>
const fs = require("fs");
const path = require("path");
import axios from "axios";
import { ref, watch, nextTick, onMounted } from "vue";
import { message } from "ant-design-vue";
const keywords = ref("JavaScript");
const bookList = ref([]);
const page = ref(1); // 当前页码
const totalCount = ref(0); // 总条数
const limit = ref(20); // 每次取的条数
const cardBody = ref(null); // cardBody 元素
import useResize from "../../hooks/useResize";
import Menu from "../../components/menu/index.vue";
import selectAnimate from "../../utils/select-animate";
var request = require("request");

const downTotalBooks = ref(0); // 已经下载的条数
const downingBooks = ref(0); // 正在下载的条数
// console.log(path.resolve("./books/01.epub"));

const columns = [
  {
    title: "ID",
    dataIndex: "bookId",
    key: "bookId",
    width: 100,
  },
  {
    title: "书名",
    dataIndex: "title",
    key: "title",
    width: 150,
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
    width: 150,
  },
  {
    title: "封面",
    dataIndex: "cover",
    key: "cover",
    // slots: { title: "cover", customRender: "cover" },
    width: 150,
  },
  {
    title: "描述",
    key: "intro",
    dataIndex: "intro",
    // slots: { title: "intro", customRender: "intro" },
    // width: 400,
  },

  {
    title: "操作",
    dataIndex: "handler",
    key: "handler",
    // slots: { title: "handler", customRender: "handler" },
    width: 100,
    fixed: "right",
  },
];
const tableScroll = useResize(cardBody);
getDownLoadedNum();
onMounted(() => {
  cardBody.value = document.querySelector(".card-container .ant-card-body");
});
const fmtIntro = (v) => {
  const t = v.slice(0, 50);
  return t.length < 50 ? t : t + "...";
};
const searchBooks = () => {
  loadBooks();
};

const loadBooks = async () => {
  const result = (
    await axios.get(
      `https://weread.qq.com/web/search/global?keyword=${
        keywords.value
      }&maxIdx=${limit.value * page.value}&fragmentSize=120&count=${
        limit.value
      }`
    )
  ).data;

  const books = result.books.map((v) => ({
    ...v.bookInfo,
    intro: fmtIntro(v.bookInfo.intro),
  }));
  totalCount.value = result.totalCount;
  bookList.value = books;
};
loadBooks();
const showSizeChange = (current, size) => {
  limit.value = size;
  loadBooks();
};

const pageChange = (current, size) => {
  page.value = current;
  loadBooks();
};

const download = (index, ext, event) => {
  const targetRect = event.target.getBoundingClientRect();
  const menu = document.querySelector(".menu-container");
  const meunRect = menu.getBoundingClientRect();
  selectAnimate(
    {
      x: targetRect.x + targetRect.width / 2,
      y: targetRect.y + targetRect.height / 2,
    },
    {
      x: meunRect.x + meunRect.width / 2,
      y: meunRect.y + meunRect.height / 2,
    }
  );
  if (!fs.existsSync("books")) {
    fs.mkdirSync("books");
  }
  index = String(index).padStart(2, "0");
  message.info("正在下载中，请稍后！！");
  downingBooks.value++;
  request(
    encodeURI(`http://121.5.230.70:8080/books/精灵使的剑舞${index}.${ext}`)
  )
    .pipe(fs.createWriteStream(`./books/${index}.${ext}`))
    .on("close", function (err) {
      if (err) {
        message.error(`${index}持久化失败`);
      } else {
        message.success(`${index}下载成功`);
        getDownLoadedNum();
        downingBooks.value--;
      }
    });
};
function getDownLoadedNum() {
  if (!fs.existsSync("./books")) {
    downTotalBooks.value = 0;
  } else {
    fs.readdir("./books", (err, files) => {
      if (!err) {
        downTotalBooks.value = files.filter((file) =>
          /\.epub$/.test(file)
        ).length;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &::v-deep(.ant-card-body) {
    flex: 1;
    overflow: hidden;
  }
  .v-gray {
    color: #999;
  }
  .page-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
  }
}
</style>
