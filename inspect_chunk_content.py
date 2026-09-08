import re

chunk = open(r'assets\chunks\concepts_what-is-llm.md.Cmq285ku.js', 'r', encoding='utf-8').read()
print("Length:", len(chunk))
# let's see what's inside
for m in re.finditer(r'(_createStaticVNode\(".*?",\s*\d+\))', chunk):
    print("Found static node call")
    s = m.group(0)
    print(s[:300])
