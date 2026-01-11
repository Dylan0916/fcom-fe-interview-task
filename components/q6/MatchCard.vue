<template>
  <div>
    <h3 class="text-base text-gray-200 mb-4 text-center font-normal">{{ match.homeTeam }} vs {{ match.awayTeam }}</h3>
    <div class="flex gap-2 justify-center">
      <OddsButton
        v-for="config in betConfigs"
        :key="config.betType"
        :label="config.label"
        :odds="match.odds[config.betType]"
        :bet-type="config.betType"
        :is-selected="config.isSelected"
        :is-in-conflict="config.isInConflict"
        @click="handleOddsClick(config.betType)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BetType, Match, BetState } from '@/types/betting'
import { BET_CONFIGS } from '@/constants/betting'
import { getBettingKey } from '@/utils/betting'
import OddsButton from '@/components/q6/OddsButton.vue'

export interface Props {
  match: Match
  betStates: ReadonlyMap<string, BetState>
}

interface Emits {
  oddsClick: [betType: BetType]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const betConfigs = computed(() =>
  BET_CONFIGS.map(config => {
    const key = getBettingKey(props.match.id, config.betType)

    return {
      ...config,
      isSelected: props.betStates.get(key)?.isSelected ?? false,
      isInConflict: props.betStates.get(key)?.isInConflict ?? false,
    }
  })
)

function handleOddsClick(betType: BetType) {
  emit('oddsClick', betType)
}
</script>
