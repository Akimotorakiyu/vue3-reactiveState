import { ref, watchEffect } from "vue";

const createReactiveStore = <T>(fn: () => Promise<T>) => {
  const state = ref<T>();
  const updateState = async () => {
    state.value = await fn();
  };
  const useData = () => {
    return {
      state,
      promise: updateState(),
    };
  };
  return { useData };
};

const userInfoStore = createReactiveStore(async () => {
  return {
    name: "chougege",
    sex: "male",
  };
});

const userInfo = userInfoStore.useData().state;

watchEffect(() => {
  console.log(`name:${userInfo.value.name},sex:${userInfo.value.sex}`);
});
