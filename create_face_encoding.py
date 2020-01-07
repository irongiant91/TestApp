import os
import base64
import pickle
from django.conf import settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_database.settings')

import django
django.setup()

from django.contrib.auth.models import User
from database.models import Image, FaceEncoding
import face_recognition
from django.db import transaction


def create_face_encoding(data):
    try:
        with transaction.atomic():
            image = Image(
                path=data['path']
            )
            image.full_clean()
            image.save()

            profile = FaceEncoding(
                user = User.objects.get(id=data['user'], is_active=True),
                image = image,
                encoding = data['face_encoding']
            )
            profile.full_clean()
            profile.save()
        print('UserProfile created successfully')

    except Exception as e:
        print(e)
        print("Error in Stage Create")

if __name__ == '__main__':
    data = {
        'path': str(settings.MEDIA_ROOT)+'/anandhu.jpg',
        'user': 1,
        'face_encoding' : base64.b64encode(pickle.dumps(face_recognition.face_encodings(face_recognition.load_image_file(str(settings.MEDIA_ROOT)+"/anandhu.jpg"))[0])),
    }
    create_face_encoding(data)

    data = {
        'path': str(settings.MEDIA_ROOT)+'/jose.jpg',
        'user': 2,
        'face_encoding' : base64.b64encode(pickle.dumps(face_recognition.face_encodings(face_recognition.load_image_file(str(settings.MEDIA_ROOT)+"/jose.jpg"))[0])),
    }
    create_face_encoding(data)

    data = {
        'path': str(settings.MEDIA_ROOT)+'/jose2.jpg',
        'user': 2,
        'face_encoding' : base64.b64encode(pickle.dumps(face_recognition.face_encodings(face_recognition.load_image_file(str(settings.MEDIA_ROOT)+"/jose2.jpg"))[0])),
    }
    create_face_encoding(data)
