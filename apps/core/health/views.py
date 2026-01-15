from django.http import JsonResponse
from core.spotify import search_tracks

def health(request):
    return JsonResponse({
        "status": "ok",
        "service": "core"
    })

def music_by_mood(request):
    mood = request.GET.get("mood", "neutral")

    mood_query_map = {
        "happy": "feel good pop",
        "sad": "sad acoustic",
        "neutral": "lofi chill",
    }

    query = mood_query_map.get(mood, "lofi chill")
    tracks = search_tracks(query)

    return JsonResponse({
        "mood": mood,
        "tracks": tracks
    })