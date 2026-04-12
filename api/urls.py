from django.urls import include, path
from api import views


urlpatterns = [
    path('v1/users/register/', views.user_registration, name='user_registeration'),
    path('v1/users/login/', views.user_login, name='user_login'),
    # path('v1/', include('users.urls')),
    # path('v1/', include('points.urls')),
    # path('v1/', include('waste_types.urls')),
    # path('v1/', include('reviews.urls')),
    # path('v1/', include('djoser.urls.jwt'))
]
