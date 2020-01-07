import os
import sys    
import traceback    
import json  
from django.conf import settings    

from django.shortcuts import render, redirect
from django.contrib.auth import logout
# from django.contrib.auth.decorators 
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required  #Sreekanth

from django.contrib.auth.models import User  #Sreekanth
from database.models import *  #Sreekanth


def login_redirect(request):
    user = request.user
    if user.is_authenticated:
        return redirect('/home')
    else:        
        return render(request, 'login2.html')


def login(request):
    return render(request, 'login2.html')

def user_logout(request):
    logged_user = request.user
    logout(request)    
    response = HttpResponseRedirect('/')
    response.delete_cookie('sessionid')
    return response

@login_required
def home(request):
    return render(request, 'home.html')


def forgot_password(request):
    return render(request, 'forgot-password.html')


def initial_password_reset(request,code_text):
    try:
        code_obj = InitialPasswordReset.objects.get(code_text=code_text,is_active=True)
        return render(request, 'initial-password-reset.html')
    except InitialPasswordReset.DoesNotExist:
        msg = 'Invalid Link'
        return render(request, 'not-found-page.html')


def reset_password(request,code_text):
    try:
        code_obj = ForgotPasswordCode.objects.get(code_text=code_text,is_active=True)
        res_dct = {}
        res_dct['email'] = code_obj.user.email
        return render(request, 'reset-password.html',res_dct)
    except ForgotPasswordCode.DoesNotExist:
        msg = 'Invalid Link'
        return render(request, 'not-found-page.html')


def movie_create(request):
    return render(request, 'movie-create.html')

def movie_list(request):
    return render(request, 'movie-list.html')

def movie_detail(request, id):
    return render(request, 'movie-detail.html')
