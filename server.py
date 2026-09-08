import http.server
import socketserver
import os
import urllib.parse
import sys

PORT = int(os.environ.get("PORT", 3000))
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

class VitePressCleanUrlHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def translate_path(self, path):
        path = path.split('?', 1)[0]
        path = path.split('#', 1)[0]
        path = urllib.parse.unquote(path)
        
        words = path.strip('/').split('/')
        words = [w for w in words if w and w != '..']
        
        target = os.path.join(ROOT_DIR, *words)
        
        if os.path.isdir(target):
            index = os.path.join(target, "index.html")
            if os.path.isfile(index):
                return index
            return target
            
        if os.path.isfile(target):
            return target
            
        if os.path.isfile(target + ".html"):
            return target + ".html"
            
        index_sub = os.path.join(target, "index.html")
        if os.path.isfile(index_sub):
            return index_sub
            
        return target

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run():
    port = PORT
    while True:
        try:
            with socketserver.TCPServer(("", port), VitePressCleanUrlHandler) as httpd:
                print("\n======================================================")
                print(f"   AI 时代使用手册 - 本地预览服务器已启动 (Python)")
                print(f"   Local:   http://localhost:{port}")
                print(f"   Network: http://127.0.0.1:{port}")
                print("======================================================\n")
                httpd.serve_forever()
        except OSError as e:
            if e.errno == 98 or e.errno == 10048:
                print(f"Port {port} in use, trying {port + 1}...")
                port += 1
            else:
                raise e

if __name__ == "__main__":
    run()
