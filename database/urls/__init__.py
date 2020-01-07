from django.conf.urls import url, include

urlpatterns = [
    url('', include('database.urls.frontend')),
    url('', include('database.urls.face_detect')),
]
#DON'T FORGET TO UNCOMMENT ROUTING FROM PROJECT URL 