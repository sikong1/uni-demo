/*
 * @Author: fujw 791254376@qq.com
 * @Date: 2024-02-20 10:36:40
 * @LastEditors: fujw 791254376@qq.com
 * @LastEditTime: 2024-03-07 15:34:44
 * @FilePath: \front-end-mobile-digital-portal\src\stores\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";
interface pmsStore {
  info: object;
}
export const usePmsStore = defineStore({
  id: "pmsStore",
  state: (): pmsStore => ({
    info: {},
  }),
  persist: true,
  getters: {
    getInfo(): object {
      return this.info;
    },
  },
  actions: {
    setInfo(info: object) {
      this.info = info;
    },
  },
});
