import os
import sys    
import traceback    
import json  
import base64
import cv2
import face_recognition
import numpy as np
import PIL.Image
import pickle

from django.conf import settings    
from django.shortcuts import render, redirect
# from django.contrib.auth.decorators 
from django.http import HttpResponseRedirect  
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required  #Sreekanth
from django.contrib.auth import login, logout

from django.contrib.auth.models import User  #Sreekanth
from database.models import *  #Sreekanth


def face_login(request):
    data = request.POST.get('image2').partition(',')[2]
    imgdata = base64.b64decode(data)
    filename = str(settings.MEDIA_ROOT)+'/temp/some_image.png' 
    with open(filename, 'wb') as f:
        f.write(imgdata)
    
    img = cv2.imread(filename)
    
    face_obj = FaceEncoding.objects.all()
    images_dict = {'face_encoding': [], 'face_name': []}
    images_dict['face_encoding'] = list(face_obj.values_list('encoding', flat=True))
    images_dict['face_name'] = list(face_obj.values_list('user__first_name', flat=True))
    
    for x in range(0, len(images_dict['face_encoding'])):
        images_dict['face_encoding'][x] = pickle.loads(base64.b64decode(images_dict['face_encoding'][x]))
    
    # Create arrays of known face encodings and their names
    known_face_encodings = images_dict['face_encoding']
    known_face_names = images_dict['face_name']
    
    # Initialize some variables
    face_locations = []
    face_encodings = []
    face_names = []
    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = img[:, :, ::-1]

    # Only process every other frame of video to save time
    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
    
    face_names = []
    num_faces = 0
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        # Or instead, use the known face with the smallest distance to the new face
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]
        face_names.append(name)
    for x in range(0, len(face_encodings)):
        if face_names[x] != 'Unknown':
            user1 = User.objects.get(first_name=face_names[x])
            login(request, user1)
            return HttpResponse(content=json.dumps("Welcome, "+ str(face_names)), status=200, content_type='application/json')
    return HttpResponse(content=json.dumps('Error'), status=406, content_type='application/json')