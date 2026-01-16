import logging
from django.http import JsonResponse
from core.spotify import search_tracks


logger = logging.getLogger(__name__)

def health(request):
    return JsonResponse({
        "status": "ok",
        "service": "core"
    })

def music_by_mood(request):
    mood = request.GET.get("mood", "neutral")
    q = request.GET.get("q")
    logger.info(f"music_by_mood called with mood={mood}, q={q}")
    
    if q: 
        # if q is not empty, use q as query
        tracks = search_tracks(q)
        return JsonResponse({
            "mood": mood,
            "query": q,
            "tracks": tracks
        })
    
    else:
        # Default mood mapping
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

        