from django.urls import path
from health.views import health, music_by_mood

urlpatterns = [
    path("health/", health),
    path("music/", music_by_mood),
]
