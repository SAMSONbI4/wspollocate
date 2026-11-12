"""Foreground local preview. Closing its console terminates the server process."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


ROOT = Path(__file__).resolve().parent.parent


def create_server():
    handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    try:
        return ThreadingHTTPServer(('127.0.0.1', 5173), handler)
    except OSError as error:
        # If another app owns the port, use a free one without stopping it.
        if getattr(error, 'winerror', None) != 10048 and error.errno != 98:
            raise
        return ThreadingHTTPServer(('127.0.0.1', 0), handler)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()

    # No detached/background server: Python stays attached to the BAT console.
    with create_server() as server:
        url = f'http://127.0.0.1:{server.server_port}/'
        print(f'\nSzukam wspollokatora\n{url}', flush=True)
        print('Keep this window open. Close it or press Ctrl+C to stop the server.\n', flush=True)
        if not args.no_browser:
            try:
                if not webbrowser.open(url):
                    print('Open the URL above in your browser.', flush=True)
            except webbrowser.Error:
                print('Open the URL above in your browser.', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('\nServer stopped.', flush=True)


if __name__ == '__main__':
    main()
