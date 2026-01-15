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

SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search"

def search_tracks(query, limit=5):
    token = get_access_token()

    headers = {
        "Authorization": f"Bearer {token}"
    }

    params = {
        "q": query,
        "type": "track",
        "limit": limit,
    }

    res = requests.get(SPOTIFY_SEARCH_URL, headers=headers, params=params)
    res.raise_for_status()

    items = res.json()["tracks"]["items"]

    return [
        {
            "title": track["name"],
            "artist": track["artists"][0]["name"],
            "preview_url": track["preview_url"],
            "spotify_url": track["external_urls"]["spotify"],
            "image": track["album"]["images"][0]["url"] if track["album"]["images"] else None
        }
        for track in items
    ]
