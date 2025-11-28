Next.js + API + JWT 認証の全体理解


# ■ 前提構成（大事）

* **ブラウザ（Chromeなど）**
* **Next.js サーバ（BFF・SSR・middleware・Route Handler）**
* **APIサーバ（FastAPI）※JWT の検証・再発行担当**
* **Cookie：access_token（短命）、refresh_token（長命／Strict／Path限定）**

**「[https://example.com/dashboard」](https://example.com/dashboard」)** を入力。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ ① ブラウザで URL を入力（例： [https://example.com/dashboard）](https://example.com/dashboard）)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

### (1) DNS 解決

ブラウザは OS に問い合わせ：

```
example.com の IP アドレスは？
```

OS → DNSキャッシュを確認
なければ → ルートDNS → TLD(.com)DNS → 権威DNSへ問い合わせ
結果：

```
example.com → 203.0.113.10  （Next.jsサーバのロードバランサー等）
```

---

### (2) TCP 3ウェイハンドシェイク

ブラウザ → Next.jsサーバ に接続

```
SYN
SYN/ACK
ACK
```

TCP 接続が確立。

---

### (3) TLS ハンドシェイク

HTTPSの開始：

* 暗号化方式の合意
* サーバ証明書の検証
* 秘密鍵・公開鍵の交換
* セッション鍵の生成

すべて完了すると **暗号化通信** が確立。

---

### (4) HTTP GET /dashboard の送信

ブラウザは以下を送信：

```
GET /dashboard HTTP/1.1
Host: example.com
Cookie: access_token=xxxxx; refresh_token=yyyyy;
```

※ Cookie はブラウザが自動的に付与。
※ access_token が期限切れでも Cookie には残っている。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ ② Next.js（BFF）到達 → middleware が認証判定

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next.js の request は最初に **middleware.ts** に通される。

### (1) Cookie 読み取り

```ts
const at = cookies().get("access_token");
const rt = cookies().get("refresh_token");
```

### (2) access_token（JWT）の有効期限チェック

* 署名が正しいか
* exp が未来か

→ **有効であれば認証OK**
→ **期限切れ or なし → 次のステップへ**

---

### (3) refresh_token を使って更新要求

Next.js → APIサーバへ：

```
POST /auth/refresh
Cookie: refresh_token=yyyyy
```

※ refresh_token は Path=/auth/refresh に限定されているので、このAPIでのみ送信。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ ③ APIサーバ（FastAPI）で refresh_token の検証 & 再発行

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

FastAPI は：

### (1) refresh_token の署名を検証

（秘密鍵 or 公開鍵で verify）

### (2) サーバ側の DB/Redis と照合

保存されている情報（例）：

```
refresh_token_id
user_id
device_id
expires_at
revoked
rotated
```

* 有効期限内か？
* revoked されてないか？
* すでに使われた（ローテーション済み）ではないか？

### (3) ローテーション（最重要）

refresh_token を使ったら **新しい refresh_token を発行し、古いものは revoked にする**。

### (4) 新しい access_token と refresh_token を発行

FastAPI → Next.js に返却：

```
Set-Cookie: access_token=<新JWT>; HttpOnly; Secure; SameSite=Lax; Path=/;
Set-Cookie: refresh_token=<新RT>; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh;
```

Next.js の Cookie が更新される。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ ④ Next.js が "認証済み" と判断し SSR/RSC を実行

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next.js は認証OKなので
`/dashboard` ページをサーバサイドで生成開始。

### (1) 内部で API サーバにデータ要求

（BFFとしての役割）

Next.js → APIサーバ：

```
GET /api/userinfo
Authorization: Bearer <access_token>
```

### (2) APIサーバは access_token を検証

* 署名OK
* expOK
* roleOK

→ 正常ならデータ返却。

### (3) Next.js が React サーバコンポーネントをレンダリングして HTML を生成。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ ⑤ ブラウザに SSR結果（HTML）が返り、ページが表示される

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

TLS上のレスポンス：

```
HTTP/1.1 200 OK
Content-Type: text/html
(set-cookie: もし更新があれば)

<html> ... </html>
```

ブラウザが描画 → ユーザが dashboard 画面を見る。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ ⑥ 次のページアクセスでは再び middleware による認証判定

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

ユーザが次のページに移動しても、

* Cookie が送られる
* access_token の期限が生きていればそのまま通過
* 切れていれば refresh_token で自動更新

ユーザは **完全にシームレスにログイン状態を維持**。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ ⑦ ログアウト時

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next.js → APIサーバへ：

```
POST /auth/logout
Cookie: refresh_token=yyyyy
```

APIサーバ：

* refresh_token を revoked にする（Redis/DB更新）
* ブラウザの Cookie を削除する Set-Cookie 発行

ブラウザ側 Cookie 消滅 → 次回アクセスでログイン画面へ。

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ■ 最終まとめ（短縮版の流れ）

```
[ブラウザ]
 URL入力 → DNS → TCP → TLS → Cookie付きGET

[Next.js(BFF)]
 middlewareがaccess_tokenチェック
  → 有効 → SSR
  → 無効 → refresh_tokenでAPIへ問い合わせ

[APIサーバ]
 refresh_token検証 → access_token再発行 → Cookie返却

[Next.js]
 SSRのためAPI呼び出し(Authorization: Bearer)
 → HTML生成

[ブラウザ]
 HTML描画 → 次の遷移でもCookie送信 → 継続ログイン
```
