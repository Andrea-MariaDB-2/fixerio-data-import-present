import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs


class Server:
    def __init__(self, ip, port, db_manager):
        self.ip = ip
        self.port = port
        self.db_get_data = db_manager.get_data

    def run(self):
        print("Starting server...")
        server_address = (self.ip, self.port)
        handler = self._get_handler_class()
        httpd = HTTPServer(server_address, handler)
        print("Running server...")
        httpd.serve_forever()

    def _get_handler_class(self):
        server = self

        class HTTPRequestHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                self.send_response(200)
                self.send_header("Content-type", "application/json; charset=utf-8")
                self.send_header("access-control-allow-origin", "null")
                self.end_headers()

                args = parse_qs(urlparse(self.path).query)
                data = server._get_res_data(args)

                self.wfile.write(bytes(data, "utf8"))
                return
        return HTTPRequestHandler

    def _get_res_data(self, args):
        base = args.get("base", [""])[0].upper()
        target = args.get("target", [""])[0].upper()
        date_from = args.get("date_from", [""])[0]
        date_to = args.get("date_to", [""])[0]

        res = json.dumps(self.db_get_data(base, target, date_from, date_to))
        return res
