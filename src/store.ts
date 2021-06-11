import { computed, ref, watchEffect } from "vue";
import { IReactiveStore } from "./type";
export const createReactiveStore = <T>(
  fn: () => Promise<T>
): IReactiveStore<T> => {
  const state = ref<T>();
  const updateingPromise = ref<Promise<T>>();
  const updateing = computed(() => {
    return updateingPromise.value ? true : false;
  });

  const updateState = async () => {
    const value = await fn();
    state.value = value;
    return value;
  };

  const updater = async () => {
    if (!updateingPromise.value) {
      updateingPromise.value = updateState();
    }
    const value = await updateingPromise.value;
    updateingPromise.value = null;
    return value;
  };

  const useData = () => {
    return {
      state,
      promise: updater(),
    };
  };
  return { useData, updater, updateing };
};

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
