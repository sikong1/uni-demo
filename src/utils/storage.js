import { validatenull } from "@/utils/index";
import website from "@/config/website";
import cache from "@/utils/cache";

const keyName = website.key + "-";
/**
 * 存储localStorage
 */
export const setStore = (params = {}) => {
  const { content } = params;
  const name = keyName + params.name;
  const obj = {
    dataType: typeof content,
    content: content,
    datetime: new Date().getTime(),
  };
  cache.set(name, JSON.stringify(obj));
};
/**
 * 获取localStorage
 */

export const getStore = (params = {}) => {
  const name = keyName + params.name;
  const debug = params.debug;
  let obj = {};
  let content;
  obj = cache.get(name);
  if (validatenull(obj)) obj = cache.get(name);
  if (validatenull(obj)) return;
  try {
    obj = JSON.parse(obj);
  } catch (e) {
    return obj;
  }
  if (debug) {
    return obj;
  }
  if (obj.dataType === "string") {
    content = obj.content;
  } else if (obj.dataType === "number") {
    content = Number(obj.content);
  } else if (obj.dataType === "boolean") {
    content = Boolean(obj.content);
  } else if (obj.dataType === "object") {
    content = obj.content;
  }
  return content;
};
/**
 * 删除localStorage
 */
export const removeStore = (params = {}) => {
  const name = keyName + params.name;
  cache.remove(name);
};
