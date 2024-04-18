from flask import Flask, request, redirect,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from dataclasses import dataclass
from flask_cors import CORS, cross_origin
from numpy import genfromtxt
from datetime import datetime, timezone
import time
import datetime
from hashlib import sha256
from sqlalchemy.orm import sessionmaker
import logging
import os

#app set up
app = Flask(__name__)
cors = CORS(app, support_credentials=True)
app.config['CORS_HEADERS'] = 'application/json'
app.config['SECRET_KEY'] = '85533925b02f5917db2256d316b3b314'

#database set up
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306')
statement1 = text("CREATE DATABASE IF NOT EXISTS website;")
with engine.connect() as conn:
    conn.execute(statement1)
engine.dispose()
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1:3306/website'
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
    ingredients: str
    instructions: str
    image_name: str
    user_name: str
    upload_date: datetime.datetime

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(5000), nullable=True)
    upload_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now(timezone.utc))
    revised_date = db.Column(db.DateTime, nullable=True, default=datetime.datetime.now(timezone.utc))
    image_name = db.Column(db.String(1000), db.ForeignKey('image.image_name'), nullable=True)
    user_name = db.Column(db.String(20), db.ForeignKey('user.username'), nullable=True)
    ingredients = db.Column(db.String(5000), nullable=False)
    instructions = db.Column(db.String(5000), nullable=False)

#image table
@dataclass
class Image(db.Model):
    data: int

    image_name = db.Column(db.String(100), primary_key=True)
    data = db.Column(db.LargeBinary(length=(2**32)-1), nullable=False)
    recipes = db.relationship('Recipe', backref='picture', lazy=True)

#creates the database
db.create_all()
db.session.commit()

#checks if the user table is empty
userExists = True
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM user;"))
    if '0' in str(set(result)):
        userExists = False

#populates the user table with an admin if it is empty
if userExists == False:
    user = User(username="admin", password="749f09bade8aca755660eeb17792da880218d4fbdc4e25fbec279d7fe9f65d70", email="websiteowner@gmail.com", privilege=1)
    db.session.add(user)
    db.session.commit()

#checks if the image table is empty
imageExists = True
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM image;"))
    if len(set(result)) == 0:
        imageExists = False

#populates the image table with images from the dataset if it is empty
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
engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM recipe;"))
    if len(set(result)) == 0:
        print(set(result))
        recipeExists = False
        conn.execute(text("SET GLOBAL local_infile=1;"))
engine.dispose()

#populates the recipe table with recipes from the dataset if it is empty
if recipeExists == False:
    engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/website?local_infile=1')
    with engine.connect() as conn:
        #REPLACE FILE PATH WITH YOUR FILE PATH TO recipe.csv
        result = conn.execute(text("LOAD DATA LOCAL INFILE '/Users/miche/Documents/Spring 24/Cmsc 447/test-repo/api/recipe.csv' INTO TABLE recipe FIELDS TERMINATED BY ',' ENCLOSED BY '`' LINES TERMINATED BY '\n';"))
        conn.commit()
    engine.dispose()

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

def insert_recipe(id1, title1, description1, ingredients1, instructions1, upload_date1, revised_date1, image_name1, user_name1):
    recipe = Recipe(id=id1, title=title1, description=description1, ingredients=ingredients1, instructions=instructions1, upload_date=upload_date1, revised_date=revised_date1, image_name=image_name1, user_name=user_name1)
    db.session.add(recipe)
    db.session.commit()

def delete_recipe(id1):
    Recipe.query.filter_by(id=id1).delete()
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

def update_imageName(id1, image_name1):
    Recipe.query.filter_by(id=id1).image_name = image_name1
    db.session.commit()

@app.route("/")
def home():
    return 

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
    password = request.json['password']
    update_password(password)

#app route that deals with editing a user's email
@app.route("/edit_email", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editEmail():
    email = request.json['email']
    update_email(email)

#app route that deals with displaying a user's username
@app.route("/display_username", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayUsername():
    return User.query.get(User.username).username

#app route that deals with displaying a user's email
@app.route("/display_email", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayEmail():
    return User.query.get(User.username).email

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
    user_name = request.json['user_name']
    insert_recipe(id, title, description, ingredients, instructions, datetime.datetime.now(timezone.utc), datetime.datetime.now(timezone.utc), image_name, user_name)

#app route that deals with the deletion of a recipe
@app.route("/delete_recipe", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def deleteRecipe():
    id = request.json['id']
    delete_recipe(id)

#app route that edits recipe title
@app.route("/edit_title", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editTitle():
    title = request.json['title']
    update_title(title)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe description
@app.route("/edit_description", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editDescription():
    description = request.json['description']
    update_description(description)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe ingredients
@app.route("/edit_ingredients", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editIngredients():
    ingredients = request.json['ingredients']
    update_ingredients(ingredients)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe instructions
@app.route("/edit_instructions", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editInstructions():
    instructions = request.json['instructions']
    update_instructions(instructions)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that edits recipe image name
@app.route("/edit_imageName", methods = ['POST'])
@cross_origin(supports_creditals=True, origin="*")
def editImageName():
    image = request.json['image']
    update_imageName(image)
    update_revisedDate(datetime.datetime.now(timezone.utc))

#app route that displays recipe title
@app.route("/display_title", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayTitle():
    return Recipe.query.get(Recipe.id).title

#app route that displays recipe description
@app.route("/display_description", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayDescription():
    return Recipe.query.get(Recipe.id).description

#app route that displays recipe ingredients
@app.route("/display_ingredients", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayIngredients():
    return Recipe.query.get(Recipe.id).ingredients

#app route that displays recipe instructions
@app.route("/display_instructions", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayInstructions():
    return Recipe.query.get(Recipe.id).instructions

#app route that displays recipe author
@app.route("/display_author", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayAuthor():
    return Recipe.query.get(Recipe.id).user_name

#app route that displays the date the recipe was uploaded
@app.route("/display_uploadDate", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayUploadDate():
    return Recipe.query.get(Recipe.id).upload_date

#app route that displays the date the recipe was most recently revised
@app.route("/display_revisedDate", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayRevisedDate():
    return Recipe.query.get(Recipe.id).revised_date

#app route that displays recipes
@app.route("/display_recipes", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def displayRecipes():
    return Recipe.query.all()

@app.route('/api/time')
def get_curr_time():
    return {'time': time.time()}

#if __name__ == '__main__':
    #app.run(debug=True)