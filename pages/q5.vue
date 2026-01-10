<template>
  <div>
    <h1 class="text-2xl font-bold">
      <span>Q5</span>
      <ClientOnly>
        <CurrentTime />
      </ClientOnly>
    </h1>

    <UCollapsible class="rounded-lg border border-gray-200 p-4">
        <h2 class="text-4">Click to see some hints</h2>
        <template #content>
          <VideoCard :source="vQ5" />
        </template>
      </UCollapsible>
    <Separator />

    <h2 class="text-lg">Show Data here:</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Q5Card v-for="item in data" :key="item.id" :item="item" />
    </div>

    <button @click="run()">Run</button>
  </div>
</template>

<script lang="ts" setup>
import { useQ5 } from '@/composables/useQ5'
import vQ5 from '@/assets/q5.mov'

/**
 * 請取得 list 中的每一筆資料的 detail, 並且將結果寫入 data
 * Please get the detail of each item in list, and write the result to data
 * 
 * Note:
 * - fetchList 與 fetchDetail 都是模擬 API 請求的函數
 */
const BATCH_SIZE = 20
const BATCH_DELAY = 1000

defineOptions({
  name: 'Q5',
})

const data = ref<any>([])

const { 
  fetchList,
  fetchDetail,
} = useQ5()
const { isProcessing: isChunkTaskProcessing, start: startChunkTask } = useChunkTask()

const run = async () => {
  try {
    if (isChunkTaskProcessing.value) {
      return
    }

    const list: { id: string }[] = await fetchList()

    await startChunkTask(
      list,
      item => fetchDetail(item.id),
      chunkResults => {
        data.value.push(...chunkResults)
      },
      { batchSize: BATCH_SIZE, batchDelay: BATCH_DELAY }
    )
  } catch (error) {
    console.error(error)
  }
}

</script>

<style>

</style>