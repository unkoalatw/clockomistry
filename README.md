# Clockomistry

一個現代感十足、具備多種主題風格的網頁時鐘應用程式。結合了時鐘、計時器與碼表功能，並支援全螢幕與專注模式 (Zen Mode)。

![專案預覽](https://via.placeholder.com/800x450?text=Clockomistry+Preview)
*(建議上傳實際截圖後替換此連結)*

## ✨ 特色功能

*   **多樣化主題**：內建極夜黑、光學白、霓虹紫 (Cyberpunk)、水晶綠等多種風格。
*   **自訂字體**：支援現代無襯線體、經典襯線體、工程等寬體及未來感字體，甚至可上傳自己的字體檔案。
*   **多功能計時**：
    *   **時鐘**：顯示當地時間，支援毫秒顯示。
    *   **計時器**：可設定倒數時間。
    *   **碼表**：支援計次 (Lap) 功能。
*   **專注體驗**：
    *   **Zen Mode**：隱藏多餘介面，只保留時間顯示。
    *   **全螢幕模式**：提供沉浸式體驗。
*   **世界時鐘**：支援多國時區顯示（需於設定中開啟）。

## 🛠️ 技術棧

*   **前端框架**：React 18 (透過 CDN 與 Babel 運行，無需複雜構建)
*   **樣式與設計**：Tailwind CSS v4 (使用 CLI 編譯)
*   **圖標庫**：Lucide React
*   **字體**：Google Fonts (Orbitron, Playfair Display, JetBrains Mono)
*   **後端/伺服器**：Python SimpleHTTPServer (用於本地開發與預覽)

## 🚀 快速開始

### 前置需求
*   [Node.js](https://nodejs.org/) (用於編譯 Tailwind CSS)
*   [Python](https://www.python.org/) (選擇性，用於快速啟動本地伺服器)

### 安裝與編譯

1.  **複製專案**
    ```bash
    git clone https://github.com/your-username/aesthetic-clock.git
    cd aesthetic-clock
    ```

2.  **安裝依賴**
    ```bash
    npm install
    ```

3.  **編譯 CSS**
    ```bash
    npm run build
    ```
    *   若要開發時自動監聽修改，可執行：`npm run watch`

### 執行專案

你可以使用以下指令快速啟動本地伺服器：

```bash
npm start
```
或者直接執行：
```bash
python index.py
```
這將會自動開啟瀏覽器並訪問 `http://localhost:8000`。

## 📁 專案結構

*   `index.html`: 應用程式入口與 React 掛載點。
*   `script.js`: 主要 React 應用程式邏輯 (包含所有組件與狀態管理)。
*   `input.css`: CSS 原始碼 (包含 Tailwind 指令與自訂字體)。
*   `output.css`: 編譯後的 CSS 檔案 (由 input.css 生成)。
*   `index.py`: 簡單的 Python HTTP 伺服器腳本。
*   `package.json`: 專案設定與腳本。

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request 來改進這個專案！

## 📄 授權

此專案採用 MIT 授權。
