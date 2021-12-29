const isObject = val => val !== null && typeof val === 'object'
const convert = target => isObject(target) ? reactive(target) : target
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key) => hasOwnProperty.call(target, key)

function reactive(target) {
  if (!isObject(target)) return target

  const handler = {
    get (target, key, receiver) {
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      return convert(result)
    },
    set (target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      if (oldValue === value) { return true }
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result;
    },
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (hadKey && result) {
        // 触发更新
        console.log('delete 触发更新');
      }
      return result
    },
  }

  return new Proxy(target, handler)
}

let activeEffect = null
function effect(callback) {
  activeEffect = callback
  callback()
  activeEffect = null
}

let targetMap = new WeakMap()
function track(target, key) {
  if(!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)
}

function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}

function ref (val) {
  if (isObject(val) && val.__v_isRef) return
  let value = convert(val)
  const r = {
    __v_isRef: true,
    get value() {
      track(r, 'value')
      return value
    },
    set value(newValue) {
      if (newValue === val) return
      value = convert(newValue)
      trigger(r, 'value')
    }
  }
  return r;
}

function toRefs (proxy) {
  const ret = proxy instanceof Array ? new Array(proxy.length) : {}

  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key)
  }

  return ret
}

function toProxyRef(proxy, key) {
  const r = {
    __v_isRef: true,
    get value () {
      return proxy[key]
    },
    set value (newValue) {
      proxy[key] = newValue
    }
  }
  return r
}

function computed (getter) {
  const result = ref()

  effect(() => (result.value = getter()))

  return result
}
