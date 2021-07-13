import { watchEffect } from "vue";
import { createMessageCenter } from "./message";
import { createStoreFactory } from "./factory";

export { createStoreFactory, createMessageCenter };
const { storeFactory, messageCenter } = createStoreFactory();

{
  const userInfoStore = storeFactory(
    async (id: string) => {
      return {
        id,
        name: id + "chougege",
        sex: Math.random() > 0.5 ? "female" : "male",
      };
    },
    (ctx, event, ...args) => {
      if (event === "hello") {
        ctx.updater(args[0]);
      }
    }
  );

  watchEffect(() => {
    console.log(`正在更新：${userInfoStore.updateing.value}`);
  });

  const userInfo = userInfoStore.useData("ddd").state;

  watchEffect(() => {
    console.log(`name:${userInfo.value?.name},sex:${userInfo.value?.sex}`);
  });

  setInterval(() => {
    // userInfoStore.updater("ddd");
    messageCenter.dispatch("hello", "id" + Math.random().toFixed(2));
  }, 2000);
}
