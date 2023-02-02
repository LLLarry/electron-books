export default (startPositon, endPosition) => {
  const el = document.createElement("div");
  const child = document.createElement("div");
  el.setAttribute(
    "style",
    `width: 16px; height: 16px;  border-radius: 50%; position: absolute;
    left: ${startPositon.x}px;
    top: ${startPositon.y}px;
    transition: left 1s linear;
  `
  );
  child.setAttribute(
    "style",
    `
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: red;
    position: absolute;
    left: 0px;
    top: 0px;
    transition: top 1s cubic-bezier(0.51,-0.79, 1, 1);
  `
  );
  el.appendChild(child);
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.setProperty("left", `${endPosition.x}px`);
    child.style.setProperty("top", `${endPosition.y - startPositon.y}px`);
  });
  el.addEventListener("transitionend", () => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
};
