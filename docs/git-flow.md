# ブランチの基本構成

`main -> feature/issue-xxx`

---

## 平常時のフロー

1. `feature/issue-123` で実装
2. PR → `main` にマージ
3. `main` を STG にデプロイしてテスト
4. `main` を本番にデプロイ
5. 本番に出たコミットにタグを打つ（例：`v1.2.3`）

```bash
git tag v1.2.3
git push origin v1.2.3
```

---

## ホットフィックス時のフロー

前提：

* 本番：`v1.2.3`
* `main`：次のリリース候補（v1.2.4 になりそうな変更）が色々入っていて STG で検証中
* 本番の `v1.2.3` にバグが見つかった

やりたいこと：
「本番だけをサクッと直したい。開発中の v1.2.4 とは切り離したい」

### 1. 本番タグから hotfix ブランチを切る

タグ v1.2.3 を起点に hotfix ブランチを作る

```bash
# どこにいてもOK（main にいてもいい）
git checkout -b hotfix/critical-bug v1.2.3
```

### 2. hotfix ブランチで修正してテスト

```bash
# 修正して
git commit -am "Fix: critical bug on v1.2.3"
```

* これを STG にデプロイしてテスト
* OK なら本番にもデプロイ

### 3. 本番に出たコミットに **新しいタグ** を付ける

ホットフィックス後は「別の状態」になるので、`v1.2.4` などの新しいタグを付けます。

```bash
git tag v1.2.4   # hotfix のコミットに
git push origin v1.2.4
```

### 4. hotfix ブランチを main にマージ

最後に、今後の開発ラインにもこの修正を取り込むために：

```bash
git checkout main
git merge hotfix/critical-bug
git push origin main
```

これで、

* 本番：`v1.2.4`
* main：`v1.2.4` + 進行中の次期リリース向けの変更

という状態になる。

---


## 通常運用とある程度の規模のプロジェクトが並行で進んだ場合

feature flag で隠せるレベルの改修であればブランチの運用を分ける必要はない。
feature flag で隠せないレベルの大改修の場合は **プロジェクト用ブランチを切って、定期的に main から取り込み続ける戦略は“あり”**

---

## 1. まず大前提：本当に「隠せない」のか一度は疑う

いきなりブランチ増やす前に、ここだけは毎回確認する。

* DB 変更：
  → expand / contract 方式（列追加→両対応→旧列削除）で段階導入できないか？
* API 変更：
  → `/v2/...` を追加して少しずつ移行できないか？
* UI 変更：
  → URL やルーティング単位で新旧を分離できないか？

「これはもうシステムの骨を折り直すレベルだから、どう考えても途中状態は本番に出せない」
というところまで来てるなら、**初めて project ブランチの出番**

---

## 2. プロジェクト用ブランチを切るときの基本スタイル

```text
main                ← いつもの運用（A/B/C が担当）
  ├ feature/sprint-xxxx-xxx
  └ fix/bug-yyyy-zzz

project/big-refactor   ← D/E 用のプロジェクトブランチ
  ├ feature/big-ref-01
  ├ feature/big-ref-02
  └ feature/big-ref-03
```

### 作り方

```bash
# 安定した main からプロジェクトブランチを作る
git checkout main
git checkout -b project/big-refactor
git push origin project/big-refactor
```

D/E は基本ここからブランチを切る：

```bash
git checkout project/big-refactor
git checkout -b feature/big-ref-01-api
```

---

## 3. main からの取り込みは細かく

* **main に“意味のある変更”が入るたび or 1〜2週間に1回は**
  `project/big-refactor` に main を取り込み、 「修正内容の乖離」が起きないようにひたすら main → project を流し込む。

```bash
# project ブランチ側で main を取り込む（マージ派）
git checkout project/big-refactor
git pull origin project/big-refactor
git merge origin/main
# コンフリクト直して push
git push origin project/big-refactor
```

or rebase 派なら：

```bash
git checkout project/big-refactor
git fetch origin
git rebase origin/main
git push -f origin project/big-refactor
```

※チームの文化次第で merge / rebase はお好みで。

---

## 5. プロジェクトが終盤になったときの流れ

3ヶ月の大改修がまとまってきたら：

1. `project/big-refactor` で main を最新に追従させる
   （この時点で超コンフリクトが少ない状態にしておくのが前提）
2. 大きめの PR として `project/big-refactor` → `main` を出す
3. STG で集中テスト
4. 問題なければ本番デプロイ → `git tag`（例：v2.0.0）
5. 終わったら `project/big-refactor` は **削除** して封印

```bash
git branch -d project/big-refactor
git push origin --delete project/big-refactor
```

長命ブランチをいつまでも残しておくと、数ヶ月後に誰かが「お、これから切るか」と事故を起こしがちなので、**儀式的に消す**のが吉。

---

