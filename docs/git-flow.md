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
