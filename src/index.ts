import { watchEffect } from "vue";
import { createMessageQueue } from "./message";
import { createFactory } from "./factory";

export { createFactory, createMessageQueue };
const factory = createFactory();

{
  const userInfoStore = factory.storehouse(
    async (id: string) => {
      return {
        id,
        name: id + "chougege",
        sex: Math.random() > 0.5 ? "female" : "male",
      };
    },
    (state, updater, updateing, event, ...args) => {}
  );

  watchEffect(() => {
    console.log(`正在更新：${userInfoStore.updateing.value}`);
  });

  const userInfo = userInfoStore.useData("ddd").state;

  watchEffect(() => {
    console.log(`name:${userInfo.value?.name},sex:${userInfo.value?.sex}`);
  });

  setInterval(() => {
    userInfoStore.updater("ddd");
  }, 2000);
}
