from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings

urlpatterns = [
    path('login/', views.login),
    path('logout/', views.logout),
    path('interaction/', views.interaction),
    path('friends/', views.friends),
    path('summary/', views.summary),
    path('recommendation/', views.recommendation),
    path('email/', views.email),
    path('viz/', views.viz),
    path('viz_viewer/', views.viz_viewer),
]

if settings.DEBUG:
    urlpatterns += [
        path('email_debug/', views.email_debug),
        path('viz_debug/', views.viz_debug),
    ]
