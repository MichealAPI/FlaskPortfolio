import os

from flask import Request


def sanitize_markdown(data: str) -> str | None:

    if data is None:
        return ""

    # Replace EOL to \n
    return (data.replace("\r\n", "\n")
            .replace("\r", "\n"))

def check_credentials(request: Request) -> bool:
    # Check if the request has the right credentials
    return request.args.get('auth') == os.getenv('API_KEY')