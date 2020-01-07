import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_database.settings')

import django
django.setup()

from django.contrib.auth.models import User
from database.models.annotate import *
from django.db import transaction
import random
from faker import Faker
from datetime import datetime
import numpy as np

#Populate Author
def populate_author(data):
    try:
        faker = Faker()
        with transaction.atomic():
            for i in range(data):
                name = faker.name()
                age = random.randint(25, 100)
                
                auth = Author(
                    name = name,
                    age = age
                ) 
                auth.full_clean()
                auth.save()
                print('Author Created')
    except Exception as e:
        print(e)
        print("Error in population" )   

 
#Populate Publisher
def populate_publisher(data):
    try:
        faker = Faker()
        with transaction.atomic():
            for i in range(data):
                name = faker.company()
                
                pub = Publisher(
                    name = name
                ) 
                pub.full_clean()
                pub.save()
                print('Publisher Created')
    except Exception as e:
        print(e)
        print("Error in population" )   


#Populate Store
def populate_store(data):
    try:
        faker = Faker()
        with transaction.atomic():
            for i in range(data):
                name = faker.company()
                book_id = np.random.randint(1, 1000, 20)
                stor = Store(
                    name = name,
                ) 
                stor.full_clean()
                stor.save()
                for id in book_id:
                    stor.books.add(Book.objects.get(id=id))
                print('Publisher Created')
    except Exception as e:
        print(e)
        print("Error in population" )   

#Populate Author
def populate_book(data):
    try:
        faker = Faker()
        with transaction.atomic():
            for i in range(data):
                print(round(random.uniform(1,1000), 2))
                book = Book(
                    name = faker.word() + ' ' + faker.word() + ' ' + faker.word(),
                    pages = random.randint(50, 999),
                    price = str(round(random.uniform(1,1000), 2)),
                    rating = random.uniform(0.5, 5),
                    authors = Author.objects.get(id=random.randint(2,56)),
                    publisher = Publisher.objects.get(id=random.randint(1,15)),
                    pubdate = faker.date()
                )
                book.full_clean()
                book.save()
                print('Book Created')
    except Exception as e:
        print(e)
        print("Error in population" )   


if __name__ == '__main__':
    # populate_prospect_pool(5900)
    # populate_author(50)
    # populate_publisher(13)
    populate_store(30)