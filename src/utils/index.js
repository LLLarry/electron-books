/**
 * 判断 bEle是否是a元素的子元素、或者相同元素
 * @param {*} aEle
 * @param {*} bEle
 */
export const checkIncludeEle = (aEle, bEle) => {
  if (!aEle || !bEle) return false;
  if (aEle.isSameNode(bEle)) return true;

  return checkIncludeEle(aEle, bEle.parentNode);
};
