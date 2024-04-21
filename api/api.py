from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from dataclasses import dataclass
from flask_cors import CORS, cross_origin
from numpy import genfromtxt
from datetime import datetime, timezone
from sqlalchemy.dialects.mysql import LONGTEXT
import time
import datetime
from hashlib import sha256
from sqlalchemy.orm import sessionmaker
from elasticsearch import Elasticsearch
import logging
import os

#app set up
app = Flask(__name__)
cors = CORS(app, support_credentials=True)
app.config['CORS_HEADERS'] = 'application/json'
app.config['SECRET_KEY'] = '85533925b02f5917db2256d316b3b314'

#search set up
usrname = "elastic"
passwd = "123456"
es = Elasticsearch(['https://localhost:9200'], verify_certs=False, http_auth=(usrname, passwd))

#database set up
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306')
statement1 = text("CREATE DATABASE IF NOT EXISTS website1;")
with engine.connect() as conn:
    conn.execute(statement1)
engine.dispose()
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1:3306/website1'
db = SQLAlchemy(app)
app.app_context().push() 

#user account table
@dataclass
class User(db.Model):
    password: str
    email: str
    privilege: int

    username = db.Column(db.String(20), primary_key=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(30), nullable=False)
    privilege = db.Column(db.Integer, nullable=False, default=0)
    recipes = db.relationship('Recipe', backref='author', lazy=True)

#recipe table
@dataclass
class Recipe(db.Model):
    title: str
    description: str
    upload_date: datetime.datetime
    revised_date: datetime.datetime
    image_name: str
    user_name: str
    ingredients: str
    instructions: str

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(LONGTEXT, nullable=True)
    upload_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now(timezone.utc))
    revised_date = db.Column(db.DateTime, nullable=True, default=datetime.datetime.now(timezone.utc))
    image_name = db.Column(db.String(500), db.ForeignKey('image.image_name'), nullable=True)
    user_name = db.Column(db.String(20), db.ForeignKey('user.username'), nullable=True)
    ingredients = db.Column(LONGTEXT, nullable=False)
    instructions = db.Column(LONGTEXT, nullable=False)

#image table
@dataclass
class Image(db.Model):
    data: int

    image_name = db.Column(db.String(500), primary_key=True)
    data = db.Column(db.LargeBinary(length=(2**32)-1), nullable=False)
    recipes = db.relationship('Recipe', backref='picture', lazy=True)

#creates the database
db.create_all()
db.session.commit()

#checks if the user table is empty
userExists = True
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website1')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM user;"))
    if '0' in str(set(result)):
        userExists = False

#populates the user table with an admin if it is empty
if userExists == False:
    user = User(username="admin", password="749f09bade8aca755660eeb17792da880218d4fbdc4e25fbec279d7fe9f65d70", email="website1owner@gmail.com", privilege=1)
    db.session.add(user)
    db.session.commit()

#checks if the image table is empty
imageExists = True
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website1')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM image;"))
    if '(0,)' in str(set(result)):
        imageExists = False

#populates the recipe table with images if it does not have any
if imageExists == False:
    count = 0
    for filename in os.listdir('Food Images'):
        f = os.path.join('Food Images', filename)
        # checking if it is a file
        if os.path.isfile(f):
            with engine.connect() as conn:
                conn.execute(text("INSERT INTO image(image_name,data) VALUES('{}',LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/{}'));".format(str(filename).replace(".jpg",""), filename)))
                conn.commit()
engine.dispose()

#checks if the recipe table is empty
recipeExists = True
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website1')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM recipe;"))
    if '(0,)' in str(set(result)):
        recipeExists = False
        conn.execute(text("SET GLOBAL local_infile=1;"))
engine.dispose()

#populates the recipe table with recipes from the dataset if it is empty
if recipeExists == False:
    engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website1?local_infile=1')
    with engine.connect() as conn:
        #REPLACE FILE PATH WITH YOUR FILE PATH TO recipe.csv
        result = conn.execute(text("LOAD DATA LOCAL INFILE '/Users/miche/Documents/Spring 24/Cmsc 447/test-repo/api/recipe.csv' INTO TABLE recipe FIELDS TERMINATED BY ',' ENCLOSED BY '`' LINES TERMINATED BY '\n';"))
        conn.commit()
    engine.dispose()
print("Database populated")

index_name = 'recipe_index'
if not es.indices.exists(index=index_name):
    es.indices.create(index=index_name)

@app.route('/addToEs')
def addToEs():
    with app.app_context():
        recipes = Recipe.query.all()
        for recipe in recipes:
            es.index(index=index_name, id=recipe.id, body= {'ingredients': recipe.ingredients, 'instructions': recipe.instructions, 'upload_date': recipe.upload_date, 'revised_date': recipe.revised_date, 'title': recipe.title, 'description': recipe.description, 'user_name': recipe.user_name, 'image_name': recipe.image_name})
addToEs()


def insert_user(username1, password1, email1, privilege1):
    hashedPass = sha256(password1.encode('utf-8')).hexdigest()
    if username1 == None:
        user = User(password=hashedPass, email=email1, privilege=privilege1)
    else:
        user = User(username=username1, password=hashedPass, email=email1, privilege=privilege1)
    db.session.add(user)
    db.session.commit()

def delete_user(username1):
    User.query.filter_by(username=username1).delete()
    db.session.commit()

def update_username(username1, username2):
    User.query.filter_by(username=username1).username = username2
    db.session.commit()

def update_password(username1, password2):
    hashedPass = sha256(password2.encode('utf-8')).hexdigest()
    User.query.filter_by(username=username1).password = hashedPass
    db.session.commit()

def update_email(username1, email2):
    User.query.filter_by(username=username1).email = email2
    db.session.commit()

def insert_recipe(id1, title1, description1, upload_date1, revised_date1, image_name1, user_name1, ingredients1, instructions1):
    recipe = Recipe(id=id1, title=title1, description=description1, ingredients=ingredients1, instructions=instructions1, upload_date=upload_date1, revised_date=revised_date1, image_name=image_name1, user_name=user_name1)
    db.session.add(recipe)
    db.session.commit()

def insert_image(image_name1, image_data1):
    image = Image(image_name=image_name1, image_data=image_data1)
    db.session.add(image)
    db.session.commit()

def delete_recipe(id1):
    Recipe.query.filter_by(id=id1).delete()
    db.session.commit()

def delete_image(image_name1):
    Image.query.filter_by(image_name=image_name1).delete()
    db.session.commit()

def update_title(id1, title1):
    Recipe.query.filter_by(id=id1).title = title1
    db.session.commit()

def update_description(id1, description1):
    Recipe.query.filter_by(id=id1).description = description1
    db.session.commit()

def update_ingredients(id1, ingredients1):
    Recipe.query.filter_by(id=id1).ingredients = ingredients1
    db.session.commit()

def update_instructions(id1, instructions1):
    Recipe.query.filter_by(id=id1).instructions = instructions1
    db.session.commit()

def update_revisedDate(id1, revisedDate1):
    Recipe.query.filter_by(id=id1).revisedDate = revisedDate1
    db.session.commit()

def update_imageName(id1, image_name1, image_name2):
    Image.query.filter_by(image_name=image_name1).image_name = image_name2
    Recipe.query.filter_by(id=id1).image_name = image_name2
    db.session.commit()

def update_image(image_data1, image_name1):
    Image.query.filter_by(image_name=image_name1).image_data = image_data1
    db.session.commit()

@app.route("/")
def home():
    return 

@app.route('/search', methods = ['GET'])
def search():
    search_query = request.args.get('search_query', '')
    if search_query:
        # Perform search using Elasticsearch
        search_body = {
            'query': {
                'multi_match': {
                    'query': search_query,
                    'fields': ['title', 'ingredients']
                }
            }
        }
        search_results = es.search(index='recipe_index', body=search_body)
        recipes = [{'id': hit['_id'], **hit['_source']} for hit in search_results['hits']['hits']]
        return recipes

#app route that deals with the insertion of a user
@app.route("/create_user", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def createUser():
    username = request.json['username']
    password = request.json['password']
    email = request.json['email']
    privilege = request.json['privilege']
    insert_user(username, password, email, privilege)

#app route that deals with the deletion of a user
@app.route("/delete_user", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def deleteUser():
    username = request.json['username']
    delete_user(username)

#app route that deals with editing a user's username
@app.route("/edit_username", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editUsername():
    username = request.json['username']
    update_username(username)

#app route that deals with editing a user's password
@app.route("/edit_password", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editPassword():
    username = request.json['username']
    password = request.json['password']
    update_password(username, password)

#app route that deals with editing a user's email
@app.route("/edit_email", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editEmail():
    username = request.json['username']
    email = request.json['email']
    update_email(username, email)

#app route that deals with displaying a user's username
@app.route("/display_username", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayUsername():
    username = request.json['username']
    return User.query.get(username).username

#app route that deals with displaying a user's email
@app.route("/display_email", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayEmail():
    username = request.json['username']
    return User.query.get(username).email

#app route that deals with the upload of a recipe
@app.route("/upload_recipe", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def uploadRecipe():
    id = request.json['id']
    title = request.json['title']
    description = request.json['description']
    ingredients = request.json['ingredients']
    instructions = request.json['instructions']
    image_name = request.json['image_name']
    image_data = request.json['image_data']
    user_name = request.json['user_name']
    insert_recipe(id, title, description, datetime.datetime.now(timezone.utc), datetime.datetime.now(timezone.utc), image_name, user_name, ingredients, instructions)
    insert_image(image_name, image_data)

#app route that deals with the deletion of a recipe
@app.route("/delete_recipe", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def deleteRecipe():
    id = request.json['id']
    image = Recipe.query.get(id).image_name
    delete_recipe(id)
    delete_image(image)

#app route that edits recipe title
@app.route("/edit_title", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editTitle():
    id = request.json['id']
    title = request.json['title']
    update_title(id, title)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe description
@app.route("/edit_description", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editDescription():
    id = request.json['id']
    description = request.json['description']
    update_description(id, description)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe ingredients
@app.route("/edit_ingredients", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editIngredients():
    id = request.json['id']
    ingredients = request.json['ingredients']
    update_ingredients(id, ingredients)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe instructions
@app.route("/edit_instructions", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editInstructions():
    id = request.json['id']
    instructions = request.json['instructions']
    update_instructions(id, instructions)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe image name
@app.route("/edit_imageName", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editImageName():
    id = request.json['id']
    image_name1 = request.json['image_name1']
    image_name2 = request.json['image_name2']
    update_imageName(id, image_name1, image_name2)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe image 
@app.route("/edit_imageData", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editImageData():
    image_name = request.json['image_name']
    image_data = request.json['image_data']
    update_image(image_name, image_data)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that displays a specific recipe
@app.route("/recipe/<int:recipe_id>", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayRecipe():
    id = request.json['id']
    return Recipe.query.get(id)

#app route that displays all recipes
@app.route("/display_recipes", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayRecipes():
    return Recipe.query.all()

@app.route('/api/time')
def get_curr_time():
    return {'time': time.time()}

#if __name__ == '__main__':
    #app.run(debug=True)