from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_custom_404(self) -> None:
        error_page = ROOT / "404.html"
        content = error_page.read_bytes()
        self.send_response(HTTPStatus.NOT_FOUND)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def send_head(self):
        path = self.translate_path(self.path)
        if not Path(path).exists():
            self.send_custom_404()
            return None
        return super().send_head()


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8000), PortfolioHandler)
    print("Serving on http://127.0.0.1:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
