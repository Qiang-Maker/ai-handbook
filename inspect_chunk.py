# Inspect one chunk to see if source markdown or html string exists
chunk = open(r'assets\chunks\concepts_what-is-llm.md.DIg1477n.js', 'r', encoding='utf-8').read()
print("Length of chunk:", len(chunk))
print("Sample of chunk:", chunk[:500])
