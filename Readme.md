# ReactiveState supporter

## Features

- 领域驱动 DDD suport - Portal: provide/inject
- 统一更新 update: 统一更新调用、统一更新请求、统一更新状态

  **✨ 并同时拥有完整的类型推导 ✨**

## Use Case

```ts
import { watchEffect } from "vue";
import { createMessageCenter } from "./message";
import { createStoreFactory } from "./factory";

type MessageConstraints = {
  hello: [id: string];
  world: [id: number];
  not: [id: number];
};

const { storeFactory, messageCenter } =
  createStoreFactory<MessageConstraints>();

{
  const { storeHouse, portal } = storeFactory(
    async (id: string) => {
      return {
        id,
        name: id + "chougege",
        sex: Math.random() > 0.5 ? "female" : "male",
      };
    },
    {
      hello: (ctx, event, ...args) => {
        ctx.updater(args[0]);
      },
      world: (ctx, event, ...args) => {
        ctx.updater(`${args[0]}`);
      },
    }
  );

  const userInfoStore = storeHouse();
  userInfoStore.updater("ddd");

  watchEffect(() => {
    console.log(`正在更新：${userInfoStore.updateing.value}`);
  });

  const userInfo = userInfoStore.state;

  watchEffect(() => {
    console.log(`name:${userInfo.value?.name},sex:${userInfo.value?.sex}`);
  });

  setInterval(() => {
    messageCenter.dispatch("hello", "id" + Math.random().toFixed(2));
  }, 2000);
}
```
