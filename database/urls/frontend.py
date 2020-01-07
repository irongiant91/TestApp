from django.urls import path
from database.views import frontend 

urlpatterns = [
  path('', frontend.login_redirect),
  path('login/', frontend.login),
  path('logout/', frontend.user_logout),
  path('home/', frontend.home),
  path('movie/create/', frontend.movie_create),
  path('movie/list/', frontend.movie_list),
  path('movie/<int:id>/', frontend.movie_detail),
  
]
