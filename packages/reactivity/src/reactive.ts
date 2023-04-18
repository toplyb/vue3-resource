import { isObject } from '@vue/shared'
import { track } from './effect'

const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

const mutableHandlers = {
  get(target: Record<any, any>, key: string | symbol, receiver: any): any {
    // 如果对象被代理过，则在刚进来的时候，就会取 __v_isReactive 属性，此时就可以直接返回 true
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 依赖收集
    track(target, key)
    // 相当于 target[key]
    const res = Reflect.get(target, key, receiver)
    return res
  },
  set(target: Record<any, any>, key: string | symbol, value: any, receiver: any): boolean {
    // 相当于 target[key] = value，但是 Reflect 会自动返回一个布尔值，表示是否设置成功
    return Reflect.set(target, key, value, receiver)
  }
}

// weakMap 是弱引用，key 必须是对象，如果 key 没有被引用，则会自动销毁
const reactiveMap = new WeakMap()

function createReactiveObject(target: object) {

  // 默认认为 target 是被代理过的
  if ((target as any)[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  if (!isObject(target)) {
    return target
  }

  // 判断当前对象是否被代理过，如果被代理过，就直接返回代理后的对象
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}

export function reactive(target: object) {
  return createReactiveObject(target)
}
