from django.urls import include, path
from api import views


authentication_urls = [
    path('register/', views.user_registration, name='user_registration'),
    path('login/', views.user_login, name='user_login')
]

relative_urls = [
    path('users/', include(authentication_urls)),

]

urlpatterns = [
    path('v1/', include(relative_urls))
    # path('v1/', include('users.urls')),
    # path('v1/', include('points.urls')),
    # path('v1/', include('waste_types.urls')),
    # path('v1/', include('reviews.urls')),
    # path('v1/', include('djoser.urls.jwt'))
]
