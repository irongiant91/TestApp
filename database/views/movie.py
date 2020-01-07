import os, sys, traceback, json, base64, cv2, face_recognition, PIL.Image, pickle
import numpy as np

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import BrowsableAPIRenderer
from database.serializers import *

from django.conf import settings
from django.db import transaction
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout
from django.core.exceptions import ValidationError
from typing import Iterable

from django.contrib.auth.models import User
from database.models import Movie
from common.mixins import (
    ExceptionHandlerMixin,
    PaginationHandlerMixin,
    CustomPagination,
)

##Class to get POI List
#Author-Jose
class MovieListWebAPI(ExceptionHandlerMixin, APIView, PaginationHandlerMixin):
    pagination_class = CustomPagination
    
    def get(self, request):
        queryset = Movie.objects.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = MovieGetSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            serializer = MovieGetSerializer(queryset, many=True)
            return Response(data=serializer, status=status.HTTP_200_OK)


class MovieCreateAPI(ExceptionHandlerMixin, APIView):
    def post(self, request):
        serializer = MovieCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movie_create(**serializer.validated_data)
        return Response(status=status.HTTP_200_OK, data="Success")

def movieslist_get(request_data) -> Iterable[Movie]: 
    search_term = request_data.get('search_term')
    sort_type = request_data.get('sort_type')
    sort_by_id = request_data.get('sort_by_id')
    selected_country = request_data.get('selected_country')
    selected_city = request_data.get('selected_city')
    selected_region = request_data.get('selected_region')
    selected_country = json.loads(selected_country)
    selected_city = json.loads(selected_city)
    selected_region = json.loads(selected_region)

    pois = POI.pois.values('id','uid','name','difficulty_level').annotate(difficulty=F('difficulty_level')).order_by('uid')

    if not search_term in [None,'']:
        pois = pois.filter(Q(name__icontains=search_term)|Q(uid__icontains=search_term))
    if len(selected_country) > 0:
        pois = pois.filter(country__in=selected_country)
    if len(selected_city) > 0:
        pois = pois.filter(city__in=selected_city)
    if len(selected_region) > 0:
        pois = pois.filter(region__in=selected_region)
    if sort_type == 'ascending':
        pois = pois.order_by('name')
    if sort_type == "descending":
        pois = pois.order_by('-name')
    if sort_by_id == 'ascending':
        pois = pois.order_by('uid')
    if sort_by_id == "descending":
        pois = pois.order_by('-uid')
    return pois


def movie_delete(movie_id: int) -> None:
    try:
        with transaction.atomic():
            movie = Movie.objects.get(uid= movie_id)
            movie.is_active = False
            movie.save()
    except Movie.DoesNotExist:
        raise ValidationError("Movie with the id does not exist")
    except Exception as e:
        exc_type, exc_value, exc_traceback = sys.exc_info()
        err = "\n".join(traceback.format_exception(*sys.exc_info()))
        raise ValidationError(err)


def movie_create(title, year, genre) -> None:
    try:
        with transaction.atomic():
            movie_obj = Movie(
                title = title,
                year = year,
                genre = genre
            )
            movie_obj.full_clean()
            movie_obj.save()
    except Exception as e:
        exc_type, exc_value, exc_traceback = sys.exc_info()
        err = "\n".join(traceback.format_exception(*sys.exc_info()))
        raise ValidationError(e)