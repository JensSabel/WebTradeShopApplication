# Welcome to my Webtech 2023 Final Course Project

This code is for the final project in the *Web Technologies* course at Åbo Akademi University.

**Creator:** **Jens** Erik André **Sabel** - Student number: 1801910

**NOTE!** The Pipfile.lock works like the requirements.txt, se below on how to access (*you can also use the provided requirements.txt as normal, contains the requirements extracted from the pipenv*):

---

# Table of Contents
1. [Introduction to the application](#introduction-to-the-application)
2. [Folder structure](#folder-structure)
3. [Getting started](#getting-started)
    1. [Setting up environment with pipenv](#setting-up-the-python-virtual-environment-with-pipenv)
    2. [Setting up tbe environment with pip](#setting-up-the-python-virtual-environment-with-pip)
    3. [Installing NPM dependencies for frontend](#installing-npm-dependencies-for-frontend)
    4. [Make Python Migrations](#make-python-migrations)
4. [Starting the applications](#starting-the-application)


---
# Introduction to the application
This project is a smiple website were the users of it can trade items inbetween each other.

**Foundation**
Backend: Django/pyton
API: Django REST
Database: SQLite
Frontend: ReactJS
Created with: create-react-app
Available at: http://127.0.0.1:8080/

Will change NextJs when presonally continuing this project beside the course!

**Types of users:**
- Guest (unregistered): An unauthorized user of the website is refered to as guests. A guest can only access the main "Home"-page of the application.
- Customer (registered): An authorized user of the website is refered to as customers. Customers can access all pages besides the '/admin'-page.
- Admin: An admin can access the whole application without restrictions. An admin can also change other users items and update user details.

NOTE! When creating users + items as per assignment specifications, an admin account by the name of 'jens' will be created as well, password same as the username! This in case you want to access the admin page!

**Login/Register**
- Any guest of the website can either choose to login with username+password or create an account with a username, password and email.
- Available under /login and /register
- If an unauthenticated user tries to access pages that requires authentication, the user will be sent to the /login page.
- An authenticated user can change their password by entering their old password + their new password twice on the /account-page.

**Items:**
- Each item has the following attributes:
    1. Title: name of the item
    2. Description: text describing the item
    3. Price: price of the item
    4. Availability: availability of the item (true when for sale)
    5. Owner: owner of the item
    6. Date Added: automatically set date of when item was added
- Each of these attributes can be updated:
    - Title, description and price: can be changed from 'My Items'-page via the 'Edit item'-button.
    - Availability: Changes either when item is purchased or the owner of the item presses the 'Take off sale/Put on sale'-button on the 'My Items'-page.
    - Owner: Changes when the item is purchased by another user.
    **Note!** Admin can change these from the /admin view!
- An authenticated user can add items to the webshop via the 'Add item'-page. The date and user of the item is automatically set.

**Purchases:**
- Items can be set to the basket if the user does not already own the item. From the basket you can remove items if need be.
- An item can be purchased if:
    1. The authenticated user already owns the item.
    2. The price of the item has not change since the item was added to the basket.
    3. The availability of the item has been changed to false after the item was added to the basket.

**Home-page:**
- This is the main page of the application. This is the only view where you can access your "Shoppin Cart" contaning the items you want to purchase.
- From the homepage, any user can automatically add 6 users and 30 items to the store. This created due to requirement of assignment. After successfully adding items and users, an response will be given by the website.
- The search bar on the home page can be used to search for items currently available. The search requires only that the title of the item is contained within the search parameter.

**Routing**
- Main page/landing page: /
- My Account: /account
- My Items: /myitems
- Add Item: /additem
- Login: /login
- Register: /register
- Show item (under implementation):/item/{id}
- Admin: /admin

---

# Folder structure

The following contains the basic folder structrue for the project.

NOTE! Due to my neglicance, the first 'backend' folder is misnamed due to its location!

```
Webtech2023
│   README.md
│   requirements.txt
│   Pipfile
│   Pipfile.lock
│
└───/backend ('Should be named store or something')
    │   manage.py
    │   .gitignore
    │   db.sqlite3 (.gitignored)
    │
    └───/accounts (Handles users, accounts and access)
    │   │   urls.py
    │   │   views.py
    │   │   serializers.py
    │   │   ...
    │   
    └───/backend (Main django backend folder with settings)
    │   │   settings.py
    │   │   urls.py
    │   │   ...
    │
    └───/frontend (Main React folder)
    │   │   package.json
    │   │   package-lock.json
    │   │   README.md
    │   │   .gitignore
    │   │
    │   └───/node_modules (.gitignored)
    │   │
    │   └───/build (per assignment request)
    │   │   │   ...
    │   └───/public
    │   │   │   ...
    │   └───/src
    │       │   App.js
    │       │   index.js
    │       └───/components
    │           │   ...
    │       └───/static
    │           │   ...
    │       └───/styles
    │           │   ...
    └───/webshop
        │   models.py
        │   serializers.py
        │   views.py
        │   ...
```

---
# Getting started
## Setting up the Python Virtual Environment with Pipenv
1. Firstly, if you don't have the Python package "pipenv" installed you can do it with the following command:
    `$ pip install pipenv`

2. Start the pip virtual environment with the following command:
    `$ pipenv shell`

3. Install dependencies using the following command:
    `$ pipenv install` OR `$ pipenv install -r /path/to/requirements.txt`

## Setting up the Python Virtual Environment with pip
1. Run the following command:
    `$ pip install -r requirements.txt`

## Installing NPM dependencies for frontend
1. Navigate to the directory 'backend/frontend', this folder handles the React frontend!
    `$ cd backend/frontend`

2. Install dependencies using npm
    `$ npm install`

Note! @material-ui has built most of the frontend visuals, double check that the package has been installed as well as @emotion!

## Make Python migrations

1. In order for the program to work we also have to make the migrations:
    `$ python manage.py makemigrations`
    `$ python manage.py migrate`

---
# Starting the application
1. Change directory from the root folder to the '/backend'-folder (*the folder where manage.py is located*)
    `$ cd backend/`

2. Run the server with the following command in the root-file "backend":
    `$ python manage.py runserver`

Note! The application is set up so that the backend gets served the frontend files from the beginning!

**Website available at:** [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
NOTE! The localhost:8080/ does not work! Use above instead!
