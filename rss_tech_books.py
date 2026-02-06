from bs4 import BeautifulSoup
from datetime import datetime, timezone
from feedgen.feed import FeedGenerator
import json
import os
import requests
import re

SHOEISHA_DOMAIN = "https://www.shoeisha.co.jp"

DB_FILE = "./.data/tech_books.json"

def load_db() -> dict:
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_db(db: dict):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)


def request(url: str) -> requests.Response:
    response = requests.get(url)
    if response.status_code != 200:
        # Throw an exception if the response is not 200
        raise Exception(f"Failed to retrieve the page: {response.status_code}")
    return response

def scrape_shoeisha(soup: BeautifulSoup) -> list[dict]:
    books = []
    for div in soup.find_all("div", class_="textWrapper"):
        h3_tag = div.find("h3")
        if not h3_tag:
            continue
        a_tag = h3_tag.find("a")
        if not a_tag:
            continue

        details = {
            "title"  : a_tag.text.strip(),
            "link"   : SHOEISHA_DOMAIN + a_tag["href"],
            "summary": "翔泳社"
        }

        dt_tags = div.find_all("dt")
        dd_tags = div.find_all("dd")

        for dt_tag, dd_tag in zip(dt_tags, dd_tags):
            data_title  = dt_tag.text.strip()
            data_detail = dd_tag.text.strip()

            if data_title == "ISBN：":
                details["id"] = data_detail

        books.append(details)
    return books

def scrape_gihyo_books():
    api_url  = "https://gihyo.jp/api_gh/book/series/WEB%2BDB%20PRESS%20plus?limit=22"
    base_url = "https://gihyo.jp"

    books = []
    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        data = response.json()

        for isbn, value in data["list"].items():
            # HTML tags are included in title and subtitle
            title    = re.sub(r"<[^>]*>", "", value["title"]).strip()
            subtitle = re.sub(r"<[^>]*>", "", value["subtitle"]).strip()

            books.append({
                "id"     : isbn,
                "title"  : title + subtitle,
                "link"   : base_url + value["url"],
                "summary": "技術評論社"
            })

    except requests.exceptions.RequestException as e:
        print(f"HTTPリクエストエラー: {e}")
        return []
    except Exception as e:
        print(f"予期しないエラー: {e}")
        return []

    return books    


if __name__ == "__main__":
 
    # scraping tech books from SHOEISHA website
    response = request(SHOEISHA_DOMAIN + "/book/category/1/0/")
    soup     = BeautifulSoup(response.text, "html.parser")
    shoeisha_books    = scrape_shoeisha(soup)
    gihyo_books       = scrape_gihyo_books()

    books = shoeisha_books + gihyo_books

    # set current time
    now_utc = datetime.now(timezone.utc).isoformat()

    db = load_db()

    for book in books:
        isbn = book.get("id", "")

        if isbn in db:
            updated = db[isbn]
        else:
            db[isbn] = now_utc
            updated  = now_utc

        book["updated"] = updated

    save_db(db)

    # generate atom feed
    fg = FeedGenerator()
    fg.id("https://masaharu-suizu.github.io/rss_tech_books.atom")
    fg.title("Tracking tech books [masaharu-suizu]")
    fg.link(href="https://masaharu-suizu.github.io/rss_tech_books.atom", rel="alternate")
    fg.language("ja")

    for book in books:
        entry_tag = fg.add_entry()

        entry_tag.id(book.get("link"))
        entry_tag.title(book.get("title"))
        entry_tag.updated(book.get("updated"))
        entry_tag.link(href=book.get("link"))
        entry_tag.summary(book.get("summary"))

    atom_feed = fg.atom_str(pretty=True)
    with open("rss_tech_books.atom", "wb") as atom_file:
        atom_file.write(atom_feed)