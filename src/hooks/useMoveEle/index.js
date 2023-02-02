import { watch, onMounted, onUnmounted, isRef, ref } from "vue";
import { checkIncludeEle } from "../../utils";

export default function useMoveEle(target) {
  let tar = null;
  if (isRef(target)) {
    watch(target, () => {
      tar = target.value;
    });
  } else {
    tar = target;
  }
  let isFlag = false;
  const mousePos = ref({
    x: 0,
    y: 0,
  });
  onMounted(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });
  onUnmounted(() => {
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  });

  function handleMouseDown(event) {
    isFlag = checkIncludeEle(tar, event.target);
  }
  function handleMouseMove(event) {
    if (!isFlag) return false;
    if (tar) {
      const x = Math.min(
        Math.max(0, event.x - tar.offsetWidth / 2),
        window.innerWidth - tar.offsetWidth / 2
      );
      const y = Math.min(
        Math.max(0, event.y - tar.offsetHeight / 2),
        window.innerHeight - tar.offsetHeight / 2
      );
      mousePos.value = {
        x,
        y,
      };
      tar.style.setProperty("left", mousePos.value.x + "px");
      tar.style.setProperty("top", mousePos.value.y + "px");
    }
  }
  function handleMouseUp(event) {
    isFlag = false;
  }
}
