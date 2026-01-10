/**
 1. `deviceScope` 參數要給型別，並且要檢查是否為陣列，若為空陣列則回傳預設值
 2. deviceScope 的值可以限制在 enum 中
 3. `deviceScope.includes(3)` 和 `deviceScope.includes(2)` 的判斷式不確定是不是寫反了，因 `includes(3)` 時是設置 `isSupportPc`，而 `includes(2)` 時是重置 `isSupportApp` 和 `isSupportPc`
 4. switch-case 可以改用 map 來實現
 5. isSupportApp 和 isSupportPc 用 `is` 開頭，但型別卻不是 boolean
 6. tip 的文字靠加總來決定會有風險，若未來加上更多裝置判斷，很可能發生加總出意外的狀況
 7. 判斷支援的裝置的邏輯可以另外抽一個 function 來實現，簡化主 function 的邏輯，利於共用和測試
 */

enum DeviceScope {
  APP = 1,
  NONE = 2,
  PC = 3,
}

// enum Device

const maskTipsMap: Record<number | 'default', string> = {
  1: 'Exclusive to the App / PC',
  2: 'Exclusive to the Mobile Web',
  3: 'Exclusive to the App / Mobile Web',
  default: '',
}

function getSupportStatus(deviceScope: DeviceScope[]) {
  let isSupportApp = 0
  let isSupportPc = 0

  if (deviceScope.includes(DeviceScope.APP)) {
    isSupportApp = 1
  }
  if (deviceScope.includes(DeviceScope.PC)) {
    isSupportPc = 2
  }
  if (deviceScope.includes(DeviceScope.NONE)) {
    isSupportApp = 0
    isSupportPc = 0
  }

  return isSupportPc + isSupportApp
}

function getGiftTips(deviceScope: DeviceScope[]) {
  if (!Array.isArray(deviceScope) || deviceScope.length === 0) {
    return maskTipsMap.default
  }

  const marker = getSupportStatus(deviceScope)

  return maskTipsMap[marker] || maskTipsMap.default
}
