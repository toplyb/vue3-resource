const effectStack = []
let activeEffect
// 需要让 effect 记录依赖了哪些属性，同时属性也记录依赖了哪些 effect
class ReactiveEffect {
  // 记录是否是响应式的
  active = true
  // 记录依赖了哪些属性
  deps = []

  constructor(public fn) {

  }

  run() {
    // 如果是非响应式的，则直接执行即可
    if (!this.active) {
      return this.fn()
    }

    // 如果 effect 已经存在，则不保存
    if (!(effectStack.indexOf(this) === -1)) {
      try {
        activeEffect = this
        effectStack.push(this)
        return this.fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

// 依赖收集
export function track(target, key) {
  console.log(target)
  console.log(key)
}
