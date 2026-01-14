from django.contrib import admin
from django.urls import path
from health.views import health

urlpatterns = [
    path("health/", health),
]
