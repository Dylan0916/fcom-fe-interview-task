<template>
  <div>
    <h1 class="text-2xl font-bold">Q3</h1>
    <code-section code="Please review the code and provide any suggestions for improvement. Just like a code review you used to do." />

    <pre class="bg-gray-50/10 border border-[#00DC42]/50 dark:bg-white/5 flex flex-col gap-1 p-2 rounded-lg sm:col-span-2 my-4">
      <code>
        {{ getGiftTips }}
      </code>
    </pre>
  </div>
</template>

<script lang="ts" setup>
/**
 * q3:
 * @description 請 review 這段程式碼，並提供任何改進的建議。就像你過去做過的程式碼審查一樣。
 * @description Please review the code and provide any suggestions for improvement. Just like a code review you used to do.
 * 
 * @hint 請提供任何改進的建議，包括但不限於程式碼結構、可讀性、效能、安全性、可維護性等。
 * @hint Please provide any suggestions for improvement, including but not limited to code structure, readability, performance, security, etc.
 **/

defineOptions({
  name: 'Q3',
})

/**
 * 以下是原始 code 的建議：
 * 1. `deviceScope` 參數要給型別，並且要檢查是否為陣列，若不為陣列或空陣列則回傳預設值
 * 2. deviceScope 的值可以限制在 enum 中
 * 3. switch-case 可以改用 map 來實現
 * 4. isSupportApp 和 isSupportPc 用 `is` 開頭，但型別卻不是 boolean
 * 5. tip 的文字靠加總來決定會有風險，若未來加上更多裝置判斷，很可能發生加總衝突的狀況
 * 6. 判斷支援的裝置的邏輯可以另外抽一個 function 來實現，簡化主 function 的邏輯，利於共用和測試
 * 7. `deviceScope.includes(3)` 和 `deviceScope.includes(2)` 的判斷式不確定是不是寫反了，因 `includes(3)` 時是設置 `isSupportPc`，而 `includes(2)` 時是重置 `isSupportApp` 和 `isSupportPc`，但或許 `includes(3)` 是要支援 App 和 PC
 *
 * 下方是我假設每個 device 都有獨立值的改寫：
 */

enum DeviceScope {
  APP = 1,
  PC = 2,
  MOBILE_WEB = 3,
}

const TIPS_CONFIG = [
  {
    devices: [DeviceScope.APP, DeviceScope.PC],
    text: 'Exclusive to the App / PC',
  },
  {
    devices: [DeviceScope.APP, DeviceScope.MOBILE_WEB],
    text: 'Exclusive to the App / Mobile Web',
  },
  {
    devices: [DeviceScope.MOBILE_WEB],
    text: 'Exclusive to the Mobile Web',
  },
]
const DEFAULT_TIP = ''

function getGiftTips(deviceScope: DeviceScope[]) {
  if (!Array.isArray(deviceScope) || deviceScope.length === 0) {
    return DEFAULT_TIP
  }

  const deviceScopeSet = new Set(deviceScope)
  const config = TIPS_CONFIG.find(config => config.devices.every(device => deviceScopeSet.has(device)))

  return config ? config.text : DEFAULT_TIP
}

/**
 * 甚至若前綴都一樣，且 `DeviceScope` 中的裝置都支援，也可以這樣改寫：
 ```typescript
  enum DeviceScope {
    APP = 1,
    PC = 2,
    MOBILE_WEB = 3,
  }

  const DEVICE_TEXT_MAP = {
    [DeviceScope.APP]: 'App',
    [DeviceScope.PC]: 'PC',
    [DeviceScope.MOBILE_WEB]: 'Mobile Web',
  }
  const TIP_PREFIX = 'Exclusive to the'
  const DEFAULT_TIP = ''

  function getGiftTips(deviceScope: DeviceScope[]) {
    if (!Array.isArray(deviceScope) || deviceScope.length === 0) {
      return DEFAULT_TIP
    }

    const deviceTexts = deviceScope
      .toSorted()
      .map(device => DEVICE_TEXT_MAP[device])
      .filter(Boolean)

    return deviceTexts.length === 0 ? DEFAULT_TIP : `${TIP_PREFIX} ${deviceTexts.join(' / ')}`
  }
  ```
 */

</script>

<style>

</style>