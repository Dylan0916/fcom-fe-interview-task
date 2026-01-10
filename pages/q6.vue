<template>
  <section>
    <ClientOnly>
      <VideoCard :source="vQ6" />
    </ClientOnly>

    <section class="mt-8">
      <div class="flex flex-col gap-3">
        <MatchCard
          v-for="match in matches"
          :key="match.id"
          :match="match"
          :bet-states="betStates"
          @odds-click="toggleSelection(match.id, $event)"
        />
      </div>
      <SelectedOdds :min-odds="totalOdds.min" :max-odds="totalOdds.max" />
    </section>
  </section>
</template>

<script lang="ts" setup>
import vQ6 from '@/assets/q6.mov'
import type { Match } from '@/types/betting'
import { useBetting } from '@/composables/useBetting'
import MatchCard from '@/components/q6/MatchCard.vue'
import SelectedOdds from '@/components/q6/SelectedOdds.vue'

defineOptions({
  name: 'Q6',
})

/**
 * Team A vs Team B
 * Home Odds: 1.25
 * Away Odds: 3.75
 * Draw Odds: 10.00
 * 
 * Team C vs Team D
 * Home Odds: 1.50
 * Away Odds: 2.50
 * Draw Odds: 12.00
 * 
 * Team E vs Team F
 * Home Odds: 1.75
 * Away Odds: 2.25
 * Draw Odds: 8.00
 * 
 * 請根據以上資料完成下列事項
 * 1. UI 切版
 * 2. 選取賽事後顯示總 Odds 計算結果 (選取的 Odds 相乘)
 * 3. 需要考慮 "互斥" 的狀況, 當狀況發生, 總 Odds 會變成一個範圍 (min~max)
 * 4. "互斥" 的 Odds 背景顏色為紅色
 * 
 * ** 互斥表示同一隊伍選擇多個結果, 這些結果不會同時發生, 因此稱為互斥 **
 * 
 * e.g.
 * 情境1, 
 * User 選擇 Team A 贏, Team C 贏, Team E 贏
 * 總 Odds 為 1.25 * 1.50 * 1.75 = 3.28125
 * 
 * 情境2, 
 * User 選擇 Team A 贏, Team C 贏, Team F 贏
 * 總 Odds 為 1.25 * 12.00 * 2.25 = 33.75
 * 
 * 情境3 (互斥)
 * User 選擇 Team A 贏, Team B 贏, Team E 贏
 * 總 Odds-1 為 TeamA (1.25) * TeamE (1.75) = 2.1875
 * 總 Odds-2 為 TeamB (3.75) * TeamE (1.75) = 6.5625
 */
const matches: Match[] = [
  {
    id: '1',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    odds: {
      home: 1.25,
      draw: 10.0,
      away: 3.75,
    },
  },
  {
    id: '2',
    homeTeam: 'Team C',
    awayTeam: 'Team D',
    odds: {
      home: 1.5,
      draw: 12.0,
      away: 2.5,
    },
  },
  {
    id: '3',
    homeTeam: 'Team E',
    awayTeam: 'Team F',
    odds: {
      home: 1.75,
      draw: 8.0,
      away: 2.25,
    },
  },
]

const { betStates, totalOdds, toggleSelection } = useBetting(matches)
</script>

<style>

</style>