import os #Sreekanth
import os.path #Sreekanth
import json #Sreekanth
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_database.settings') #Sreekanth

import django #Sreekanth
django.setup() #Sreekanth

from django.contrib.auth.models import User #Sreekanth
from django.db import transaction #Sreekanth


def create_user():
    try:
        user=User.objects.create_user('anandhu', password='12345678')
        user.save()
        user=User.objects.create_user('joseseb', password='12345678')
        user.save()
        
    except Exception as e:
        print(e)
        print("Error in Stage Create")

if __name__ == '__main__':
    create_user()
