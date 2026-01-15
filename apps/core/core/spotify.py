import os
import requests
from base64 import b64encode

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"

def get_access_token():
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

    auth_str = f"{client_id}:{client_secret}"
    b64_auth = b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "client_credentials"
    }

    res = requests.post(SPOTIFY_TOKEN_URL, headers=headers, data=data)
    res.raise_for_status()
    return res.json()["access_token"]

import os
import requests
from base64 import b64encode

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"

def get_access_token():
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

    auth_str = f"{client_id}:{client_secret}"
    b64_auth = b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "client_credentials"
    }

    res = requests.post(SPOTIFY_TOKEN_URL, headers=headers, data=data)
    res.raise_for_status()
    return res.json()["access_token"]
