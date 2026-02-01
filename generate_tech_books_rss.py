import requests
from bs4 import BeautifulSoup
from feedgen.feed import FeedGenerator
from datetime import datetime, timezone

DOMAIN = "https://www.shoeisha.co.jp"
TARGET_PATH = "/book/category/1/0/"
URL = DOMAIN + TARGET_PATH

def scrape_shoeisha_books(url: str) -> list:
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to retrieve the page: {response.status_code}")
        return []

    min_dt_utc = datetime.min.replace(tzinfo=timezone.utc)

    soup = BeautifulSoup(response.text, "html.parser")
    books = []

    for div in soup.find_all("div", class_="textWrapper"):
        h3_tag = div.find("h3")
        if not h3_tag:
            continue
        a_tag = h3_tag.find("a")
        if not a_tag:
            continue

        details = {
            "title" : a_tag.text.strip(),
            "link"  : DOMAIN + a_tag["href"],
            "updated": min_dt_utc,
            "summary": "翔泳社"
        }


        books.append(details)
    return books




if __name__ == "__main__":
    fg = FeedGenerator()
    fg.id("https://github.com/masaharu-suizu/masaharu-suizu.github.io/tech_books_rss.atom")
    fg.title("Tracking tech books [masaharu-suizu]")
    fg.link(href="https://github.com/masaharu-suizu/masaharu-suizu.github.io/tech_books_rss.atom", rel="alternate")
    fg.language("ja")


    books = scrape_shoeisha_books(URL)
    for book in books:
        entry_tag = fg.add_entry()
        entry_tag.id(book.get("link", ""))
        entry_tag.title(book.get("title", ""))
        entry_tag.updated(book.get("updated"))
        entry_tag.link(href=book.get("link", ""))
        entry_tag.summary(book.get("summary", ""))

    atom_feed = fg.atom_str(pretty=True)
    with open("tech_books_rss.atom", "wb") as atom_file:
        atom_file.write(atom_feed)