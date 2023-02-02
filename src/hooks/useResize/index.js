import { ref, onBeforeUnmount, isRef, watch } from "vue";

function useResize(
  target = window,
  initValue = {
    width: 0,
    height: 0,
  }
) {
  const size = ref(initValue);
  if (target === window || target === document) {
    function handleEvent(event) {
      size.value = {
        width: event.target.innerWidth,
        height: event.target.innerHeight,
      };
    }
    target.addEventListener("resize", handleEvent);
    onBeforeUnmount(() => {
      target.removeEventListener("resize", handleEvent);
    });
  } else {
    if (!window.ResizeObserver) {
      return console.error("对不起，暂时不支持对dom的监听！");
    }

    const ro = new window.ResizeObserver((entries) => {
      for (const entrie of entries) {
        // console.log(entrie.contentRect);
        size.value = {
          width: entrie.contentRect.width,
          height: entrie.contentRect.height,
        };
      }
    });
    if (isRef(target)) {
      watch(target, () => {
        console.log("target", target);
        if (target.value instanceof Element) {
          ro.unobserve(target.value);
          ro.observe(target.value);
        }
      });
    } else {
      ro.observe(target.value);
    }
    onBeforeUnmount(() => {
      ro.disconnect();
    });
  }
  return size;
}

export default useResize;
