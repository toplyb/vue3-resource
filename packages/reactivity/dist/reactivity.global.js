var VueReactivity = (function (exports) {
  'use strict';

  function effect() {
  }

  function isObject(value) {
      return typeof value === 'object' && value !== null;
  }

  const mutableHandlers = {
      get(target, key, receiver) {
          // 如果对象被代理过，则在刚进来的时候，就会取 __v_isReactive 属性，此时就可以直接返回 true
          if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
              return true;
          }
          // 相当于 target[key]
          const res = Reflect.get(target, key, receiver);
          return res;
      },
      set(target, key, value, receiver) {
          // 相当于 target[key] = value，但是 Reflect 会自动返回一个布尔值，表示是否设置成功
          return Reflect.set(target, key, value, receiver);
      }
  };
  // weakMap 是弱引用，key 必须是对象，如果 key 没有被引用，则会自动销毁
  const reactiveMap = new WeakMap();
  function createReactiveObject(target) {
      // 默认认为 target 是被代理过的
      if (target["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */]) {
          return target;
      }
      if (!isObject(target)) {
          return target;
      }
      // 判断当前对象是否被代理过，如果被代理过，就直接返回代理后的对象
      const existingProxy = reactiveMap.get(target);
      if (existingProxy) {
          return existingProxy;
      }
      const proxy = new Proxy(target, mutableHandlers);
      reactiveMap.set(target, proxy);
      return proxy;
  }
  function reactive(target) {
      return createReactiveObject(target);
  }

  exports.effect = effect;
  exports.reactive = reactive;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=reactivity.global.js.map
