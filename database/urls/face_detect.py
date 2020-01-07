from django.conf.urls import url
from database.views import face_detect, movie

urlpatterns = [
  url(r'^api/face/detect$', face_detect.face_login),
  url(r'^api/movie/create$', movie.MovieCreateAPI.as_view()),
  url(r'^api/movie/list/get$', movie.MovieListWebAPI.as_view()),
  

]
