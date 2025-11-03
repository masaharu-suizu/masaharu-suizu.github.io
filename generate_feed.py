import os
import requests
from feedgen.feed import FeedGenerator

# 環境変数からトークンを取得
TOKEN = os.getenv("GITHUB_TOKEN")

if not TOKEN:
    raise ValueError("環境変数 GITHUB_TOKEN が設定されていません。")

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github+json"
}

api_response = requests.get("https://api.github.com/notifications", headers=headers)
if api_response.status_code != 200:
    raise RuntimeError(f"GitHub API Error: {res.status_code} - {res.text}")

entries = []

notifications = api_response.json()
for notification in notifications:
    repository = notification["repository"]
    subject    = notification["subject"]
    updated    = notification["updated_at"]

    _name    = repository["full_name"]
    _summary = repository["description"]
    _url     = subject["url"]
    _title   = subject["title"]
    _type    = subject["type"]
    _link    = ""

    if _type != "Release":
        continue

    response = requests.get(_url)
    if response.status_code == 200:
        response_json = response.json()
        _link         = response_json["html_url"]

    entries.append({
        "title": f"[{_name}] {_title}",
        "link": _link,
        "updated": updated,
        "summary": _summary
    })

fg = FeedGenerator()
fg.id('https://github.com/notifications')
fg.title('My GitHub Notifications')
fg.link(href='https://github.com/notifications', rel='alternate')
fg.language('en')

for e in entries:
    fe = fg.add_entry()
    fe.id(e["link"])
    fe.title(e["title"])
    fe.link(href=e["link"])
    fe.updated(e["updated"])
    fe.summary(e["summary"])

# Atomファイル出力
atom_feed = fg.atom_str(pretty=True)
with open("github_notifications.atom", "wb") as f:
    f.write(atom_feed)

print("✅ Atomフィードを 'github_notifications.atom' に出力しました。")

