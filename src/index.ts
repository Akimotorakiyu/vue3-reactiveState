import { watchEffect } from "vue";
import { createMessageQueue } from "./message";
import { createFactory } from "./factory";

export { createFactory, createMessageQueue };
const factory = createFactory(async () => {
  return {
    name: "chougege",
    sex: "male",
  };
});

{
  const userInfoStore = factory.storehouse();

  watchEffect(() => {
    console.log(`正在更新：${userInfoStore.updateing.value}`);
  });

  const userInfo = userInfoStore.useData().state;

  watchEffect(() => {
    console.log(`name:${userInfo.value?.name},sex:${userInfo.value?.sex}`);
  });

  setInterval(() => {
    userInfoStore.updater();
  }, 2000);
}

{
  const userInfoStore = factory.warehouse();

  watchEffect(() => {
    console.log(`正在更新：${userInfoStore.updateing.value}`);
  });

  const userInfo = userInfoStore.useData().state;

  watchEffect(() => {
    console.log(`name:${userInfo.value?.name},sex:${userInfo.value?.sex}`);
  });

  setInterval(() => {
    userInfoStore.updater();
  }, 2000);
}
