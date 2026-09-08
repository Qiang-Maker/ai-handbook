import os
from bs4 import BeautifulSoup
import html2text

# test converting one file
test_file = r'concepts\what-is-llm.html'
if os.path.exists(test_file):
    soup = BeautifulSoup(open(test_file, 'r', encoding='utf-8').read(), 'html.parser')
    content_div = soup.find('div', class_='vp-doc')
    if content_div:
        h = html2text.HTML2Text()
        h.ignore_links = False
        h.body_width = 0
        md = h.handle(str(content_div))
        print("Success converting!", len(md))
        print(md[:300])
    else:
        print("No vp-doc found")
