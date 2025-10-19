「**完全ローカル依存（グローバル汚染なし）**」な Tauri + React + TypeScript 開発環境を構築する手順。

---

## 🎯 目標

* **Node.js / npm を使わず**に
* **bun** でフロントエンドを構築
* **uv** で必要な場合に Python/Rust 依存を隔離
* **apt によるグローバルインストールなし**（＝ローカル開発者ツール環境）

---

## 🧩 前提

Tauri はバックエンドに Rust を使うので、**Rust は必須**。

---

## 🦀 1. Rust をローカルユーザ環境に導入

`rustup` は `$HOME` 配下（ユーザローカル）にインストールされる。
root 権限不要。

```bash
curl https://sh.rustup.rs -sSf | sh -s -- -y
source ~/.cargo/env
```

確認：

```bash
rustc --version
cargo --version
```

✅ これで `/home/<user>/.cargo/bin` に格納される。

---

## ⚙️ 2. bunでTauri + React + TypeScriptを新規作成

```bash
mkdir feedly-clone
cd feedly-clone

# bunでTauriテンプレートを作成
bun create tauri-app
```

途中の質問の答え方：

```
? What is your app name? feedly-clone
? Which frontend framework do you want to use? React
? Which variant do you want to use? TypeScript
```

✅ これで `src/`（React部分）と `src-tauri/`（Rust部分）が作成される。

---

## 💡 3. ローカル依存のみで開発（bun管理）

```bash
# bunが自動で依存をローカルにインストール
bun install
```

👉 `node_modules/` はプロジェクト直下に置かれるため、
**他のプロジェクトやシステムに影響なし。**

---

## 🧱 4. 開発サーバ起動（bun経由）

```bash
bun run tauri dev
```

もし `tauri` コマンドが見つからない場合は、
Tauri CLI をプロジェクトローカルに追加。

```bash
bun add -d @tauri-apps/cli
```

これで：

```bash
bunx tauri dev
```

でも起動できます。

✅ **`bunx` は npx の bun 版** で、ローカル依存を自動的に使う。

---

## 🧰 5. ネイティブ依存ライブラリ（GTKなど）

Tauri on Linux は、WebView用のネイティブライブラリが必要です。
ただしこれらは「実行時に必要」なだけなので、開発用にグローバル環境へ `apt install` する代わりに：

### ローカルコンテナ or uv環境で隔離する方法がある。

#### 🧱 例：uvで隔離した開発シェルを作る

（`uv` は Python だけでなく汎用開発環境を隔離可能）

```bash
uv venv .venv
source .venv/bin/activate
```

---

## 💻 6. Tailwind導入（bun利用）

```bash
bun add -d tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

設定は npm 版と同じ（bunはnpm互換）。

---

## 🔄 7. 起動確認

```bash
bun run tauri dev
```

→ Feedly風アプリの空ウィンドウが立ち上がればOK 🎉

---

