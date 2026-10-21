import http.server
import socket
import webbrowser
import sys
import os

try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

PORT = 8080

def get_lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def save_lan_config(ip):
    os.makedirs('data', exist_ok=True)
    with open('data/lan-config.js', 'w', encoding='utf-8') as f:
        f.write(f'window.LAN_SERVER_IP = "{ip}";\nwindow.LAN_SERVER_PORT = {PORT};\n')

class FastThreadedHandler(http.server.SimpleHTTPRequestHandler):
    # Khai bao MIME types day du de Safari/iOS khong bi chan tai nguyen
    extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
    }

    def end_headers(self):
        # Cho phep truy cap chéo va khong bi cache loi
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Ghi log gon gang
        try:
            sys.stderr.write(f"[{self.log_date_time_string()}] {self.client_address[0]} -> {args[0]} {args[1]}\n")
        except Exception:
            pass

def run_server():
    lan_ip = get_lan_ip()
    save_lan_config(lan_ip)

    # Su dung ThreadingHTTPServer de phuc vu da luong (Safari/iPad thuong mo nhieu ket noi dong thoi)
    server_address = ('0.0.0.0', PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, FastThreadedHandler)
    httpd.daemon_threads = True

    print("\n" + "=" * 65)
    print("   HI HSK - MAY CHU MANG NOI BO (DA LUONG CHO IPAD / DIEN THOAI)")
    print("=" * 65)
    print("\n[+] TRUY CAP TREN MAY TINH NAY:")
    print(f"    👉 http://localhost:{PORT}")
    print(f"    👉 http://127.0.0.1:{PORT}")
    print("\n[+] TRUY CAP TREN IPAD / DIEN THOAI (CUNG WI-FI):")
    print(f"    👉 http://{lan_ip}:{PORT}")
    print("\n[*] LUU Y QUAN TRONG CHO IPAD:")
    print("    1. Tren iPad: Mo trinh duyet Safari (hoac Chrome).")
    print(f"    2. Go chinh xac: http://{lan_ip}:{PORT}")
    print("    3. Khong go them 's' vao http (phai la http:// chu khong phai https://).")
    print("\n" + "-" * 65)
    print("Nhan Ctrl + C de dung may chu.\n")

    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Da dung may chu. Tam biet!")
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run_server()
