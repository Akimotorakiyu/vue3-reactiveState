export { createReactiveStore } from "./store";
export { createReactiveWeakStore } from "./weakStore";
import { createReactiveStore } from "./store";
import { createReactiveWeakStore } from "./weakStore";
import { watchEffect } from "vue";

{
  const userInfoStore = createReactiveStore(async () => {
    return {
      name: "chougege",
      sex: "male",
    };
  });

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
  const userInfoStore = createReactiveWeakStore(async () => {
    return {
      name: "chougege",
      sex: "male",
    };
  });

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
