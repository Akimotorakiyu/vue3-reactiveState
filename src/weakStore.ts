import { computed, ref, watchEffect, Ref } from "vue";

export const createReactiveWeakStore = <T>(fn: () => Promise<T>) => {
  const symbol = {};
  const weakMap = new WeakMap<Object, Ref<T>>();

  const updateingPromise = ref<Promise<T>>();
  const updateing = computed(() => {
    return updateingPromise.value ? true : false;
  });

  const takeState = () => {
    let state = weakMap.get(symbol);
    if (!state) {
      weakMap.set(symbol, (state = ref()));
    }
    return state;
  };

  const updateState = async () => {
    const state = takeState();
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
    const state = takeState();
    return {
      state,
      promise: updater(),
    };
  };
  return { useData, updater, updateing };
};

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
