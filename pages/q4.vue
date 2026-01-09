<template>
  <div>
    <h1 class="text-2xl font-bold">Q4</h1>
    <code-section code="Each time getData function is executed, it will return a random number. Please design a cache function, which can cache the result of the function in 5 seconds" />
    <VideoCard :source="vQ4" />
    
    <Separator />
    
    <h2 class="text-lg">Show Data here: {{ data }}</h2>
    <button @click="run">Run</button>
  </div>
</template>

<script lang="ts" setup>
import vQ4 from '@/assets/q4.mov'

defineOptions({
  name: 'Q4',
})

/**
 * 單純回傳一個隨機數
 * Simply return a random number
 */
function getData() {
  const randomNumber = Math.random();
  return randomNumber;
}

/**
 * 請設計一個 cache 函數，在 5 秒內重複觸發 getData 函數時，只會回傳上一次的結果
 * Please design a cache function, which can cache the result of the function in 5 seconds
 */
function cache<T extends any[], R>(fn: (...args: T) => R, time = 5000) {
  const cacheMap = new Map<string, { result: R, lastExecutionTime: number }>()

  return function (this: any, ...args: T) {
    const key = JSON.stringify(args)
    const cachedData = cacheMap.get(key)
    const now = performance.now()

    if (cachedData && now - cachedData.lastExecutionTime <= time) {
      return cachedData.result
    }

    const result = fn.apply(this, args)

    cacheMap.set(key, { result, lastExecutionTime: now })

    return result
  }
}


/**
 * number: 隨機數 Random number
 * count: 執行次數 Execution count
 */
const data = ref({ number: 0, count: 0 });

/**
 * 設計一個 run 函數, 每秒執行一次 cache 函數, 並且將結果寫入 data
 * Please design a run function, which can execute the cache function once per second, and write the result to data
 */
const cachedGetData = cache(getData);
const { isPolling, start: startPolling } = usePolling()

function run() {
  if (isPolling.value) {
    return
  }

  startPolling(() => {
    data.value.number = cachedGetData();
    data.value.count += 1;
  }, 1000)
}
</script>

<style>

</style>