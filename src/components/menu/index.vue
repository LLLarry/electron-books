<template>
  <div class="menu-container" ref="menu" @click="$router.push('/books')">
    <div class="menu-box">
      <div class="icon-box">
        <CloudOutlined />
        <LoadingOutlined class="loading" v-show="downingBooks > 0" />
      </div>
      <div class="d-flex">{{ tip }}</div>
    </div>
  </div>
</template>

<script setup>
import { CloudOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import useMoveEle from "../../hooks/useMoveEle";
import { computed, ref } from "vue";
const props = defineProps({
  downingBooks: {
    type: Number,
    default: 0,
  },
  downTotalBooks: {
    type: Number,
    default: 0,
  },
});

const tip = computed(() => {
  if (props.downingBooks <= 0) {
    return props.downTotalBooks;
  } else {
    return `${props.downingBooks}/${props.downTotalBooks}`;
  }
});
const menu = ref(null);
useMoveEle(menu);
</script>

<style lang="scss" scoped>
.menu-container {
  position: fixed;
  z-index: 5;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: cornflowerblue;
  box-shadow: 5px 5px 8px #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* pointer-events: none; */
  user-select: none;
  color: #fff;
  line-height: 1;

  .menu-box {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-sizing: border-box;
    border: 3px solid #ccc;
    position: relative;
    .loading {
      width: 100%;
      height: 100%;
      position: absolute;
      left: -3px;
      top: -3px;
      font-size: 50px;
      color: green;
    }
  }
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
