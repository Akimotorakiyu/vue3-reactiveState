import { watchEffect } from "vue";
import { createMessageQueue } from "./message";
import { createFactory } from "./factory";

export { createFactory, createMessageQueue };
const factory = createFactory(async (id: string) => {
  return {
    id,
    name: id + "chougege",
    sex: Math.random() > 0.5 ? "female" : "male",
  };
});

{
  const userInfoStore = factory.storehouse();

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

{
  const userInfoStore = factory.warehouse();

  watchEffect(() => {
    console.log(`正在更新：${userInfoStore.updateing.value}`);
  });

  const userInfo = userInfoStore.useData("fff").state;

  watchEffect(() => {
    console.log(`name:${userInfo.value?.name},sex:${userInfo.value?.sex}`);
  });

  setInterval(() => {
    userInfoStore.updater("fff");
  }, 2000);
}
