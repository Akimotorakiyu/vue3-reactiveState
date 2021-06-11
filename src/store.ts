import { computed, ref, watchEffect } from "vue";

export const createReactiveStore = <T>(fn: () => Promise<T>) => {
  const state = ref<T>();
  const updateingPromise = ref<Promise<T>>();
  const updateing = computed(() => {
    return updateingPromise.value ? true : false;
  });

  const updateState = async () => {
    state.value = await fn();
    return state.value;
  };

  const updater = async () => {
    if (!updateingPromise.value) {
      updateingPromise.value = updateState();
    }
    await updateingPromise.value;
    updateingPromise.value = null;
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
