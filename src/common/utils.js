import { v4 as uuidv4 } from 'uuid'
const getPixelRatio = () => window.devicePixelRatio
const fromCmToPx = (cm) => Math.round(cm * 96 / 2.54)
const fromPxToCm = (px) => px * 2.54 / 96
const fromPtToPx = (pt) => Math.round(4 * pt / 3)
const fromPxToPt = (px) => 3 * px / 4

const cloneObject = (obj) => {
  if (Object.prototype.toString.call(obj) == '[object Array]') {
    const result = [];
    obj.forEach(el => {
      result.push(cloneObject(el));
    });
    return result;
  } else if (Object.prototype.toString.call(obj) == '[object Object]') {
    const result = {};
    Object.keys(obj).forEach(el => {
      result[el] = cloneObject(obj[el]);
    });
    return result;
  } else {
    return obj;
  }
}

export {
  getPixelRatio,
  fromCmToPx,
  cloneObject,
  fromPxToCm,
  fromPtToPx,
  fromPxToPt,
  uuidv4
}
