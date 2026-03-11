# 🕒 Clockomistry 專案開發與優化總結 (2026-03-11)

這份文件總結了我們在最近幾次對話中對 Clockomistry 進行的所有性能優化與功能擴展，方便你在接續開發時參考。

## 🚀 已完成的核心優化與新功能

### 1. 深度性能優化 (2026-03-11)
- **計時器渲染節流**：將 `requestAnimationFrame` 更新頻率從 60fps 優化至 ~30fps，顯著降低 CPU 負擔。
- **計算快取 (Memoization)**：使用 `useMemo` 與 `useCallback` 優化了 `dateLabel`、`containerStyle`、`currentTheme` 與 `getWorldTime` 等關鍵計算，避免每幀重複運算。
- **CSS 靜態化**：將原本寫在 JSX 內部的動態 `<style>` 標籤全部外移至 `input.css`，減少 React 渲染時的解析開銷。
- **GPU 動畫加速**：為背景 Ambient Blobs 加入 `will-change: transform` 與 `contain` 屬性，並優化了模糊濾鏡（blur-60px）與尺寸，確保在低配裝置上也能流暢執行。
- **事件偵測優化**：對滑鼠移動偵測（螢幕保護程式觸發）加入了 1 秒防抖處理。

### 2. 實用功能擴展 (2026-03-11)
新增了 5 個可於「設定 > 一般設定」中自由開關的實用功能：
- **12 / 24 小時制切換**：支援 12 小時制並帶有精美的 AM/PM 標籤。
- **整點報時提示音**：開啟後每小時整點會播放提示音（可選響鈴種類）。
- **秒數與日期顯示開關**：提供更極簡的介面選擇，可手動隱藏秒數或日期標籤。
- **一體化儀表板模式**：全新推出的大型整合視圖！在「一般設定」中開啟後，主畫面將會轉換成類似智慧儀表板的版面組合，同時顯示主時鐘、當前氣溫與天氣、番茄鐘/計時器的當前進度與設定目標，以及下一個即將到來的紀念日倒數，充分運用寬螢幕空間。
- **下一個事件倒數標籤**：自動計算距離最近的紀念日還有幾天，並在主畫面顯示倒數膠囊。
- **新增風格字體**：整合了「未來圓」與「LINE 官方」兩種新字體，並提供完整的多國語言支援。
- **支援多國語言**：以上新功能皆已完成繁體中文、英文、日文的 i18n 翻譯。

### 3. 版面樣式與導覽
- **多樣化時鐘版面**：目前支援「經典橫排、堆疊式、極簡風、左右分離、數位儀表」五種版面，且所有新功能（如 12H 制、隱藏秒數）皆已完美適配這五種樣式。
- **全域巨大顯示**：無論是否在專注模式下，核心時間元件均保持最大視覺比例。

## ⚙️ 接下來的開發建議
1. **持久化存儲檢查**：目前所有新開關均透過 `useLocalBoolean` 持久化，若有新增狀態請繼續依照此模式。
2. **多重計時器擴展**：可考慮為多重計時器加入更多標籤選單。
3. **天氣 API 穩定性**：目前的 `useWeather` hook 為基礎實作，可考慮加入更詳細的前端錯誤處理。
4. **建置指令**：`npm run build` 會同時處理 CSS 與 JavaScript。

## 🛠️ 同步指令紀錄
- **建置專案**: `npm run build`
- **推送備份**: `git add . && git commit -m "Performance boost and new functional settings" && git push`

## 🖥️ 桌面應用程式 (Electron) 指南
我們建立了一個全新的資料夾 `clock-desktop` 作為桌面應用程式專案。

### 如何同步網頁版 (`clock`) 到桌面版 (`clock-desktop`)？
請在命令提示字元 (cmd) 中，使用以下 `robocopy` 指令同步最新的程式碼。這個指令會自動排除掉不該被覆蓋的桌面版特定檔案與套件資料夾：

```cmd
robocopy "C:\Users\timothy\Desktop\app files\clock" "C:\Users\timothy\Desktop\app files\clock-desktop" /E /XD node_modules .git /XF package.json package-lock.json main.js
```

> **💡 實用小建議**：你可以將上述指令存成 `sync.bat` 放在 `clock-desktop` 資料夾底下，以後點擊兩下就能自動同步拉取最新的網頁版程式碼。

### 桌面版專屬指令 (在 `clock-desktop` 目錄下執行)
- **啟動開發版**: `npm run desktop` (啟動一個獨立的 Electron 視窗預覽 APP)
- **打包為執行檔 (.exe)**: `npm run dist` (打包後的檔案會生成於 `dist` 資料夾內)

## 📍 目前狀態
專案已完成階段性的性能大洗牌，運行效能大幅提升且功能更豐富。代碼已模組化，分布於 `src/` 資料夾中。同時也具備了封裝成 Windows 桌面應用程式 (Electron) 的能力。
