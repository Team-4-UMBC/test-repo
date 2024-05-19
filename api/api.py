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
es = Elasticsearch(['https://localhost:9200'], verify_certs=False, basic_auth=(usrname, passwd))

#database set up
engine = create_engine('mysql+pymysql://root:password@127.0.0.1:3306')
statement1 = text("CREATE DATABASE IF NOT EXISTS website1;")
with engine.connect() as conn:
    conn.execute(statement1)
engine.dispose()
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@127.0.0.1:3306/website1'
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
    #image_name = db.Column(db.String(500), nullable=True)
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
engine = create_engine('mysql+pymysql://root:password@127.0.0.1:3306/website1')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM user;"))
    if '(0,)' in str(set(result)):
        userExists = False

#populates the user table with an admin if it is empty
if userExists == False:
    user = User(username="admin", password="8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", email="website1owner@gmail.com", privilege=1)
    db.session.add(user)
    db.session.commit()

#checks if the image table is empty
imageExists = True
engine = create_engine('mysql+pymysql://root:password@127.0.0.1:3306/website1')
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
engine = create_engine('mysql+pymysql://root:password@127.0.0.1:3306/website1')
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM recipe;"))
    if '(0,)' in str(set(result)):
        recipeExists = False
        conn.execute(text("SET GLOBAL local_infile=1;"))
engine.dispose()

#populates the recipe table with recipes from the dataset if it is empty
if recipeExists == False:
    engine = create_engine('mysql+pymysql://root:password@127.0.0.1:3306/website1?local_infile=1')
    with engine.connect() as conn:
        #REPLACE FILE PATH WITH YOUR FILE PATH TO recipe.csv
        result = conn.execute(text("LOAD DATA LOCAL INFILE '/Users/miche/Documents/Spring 24/Cmsc 447/test-repo/api/recipe.csv' INTO TABLE recipe FIELDS TERMINATED BY ',' ENCLOSED BY '`' LINES TERMINATED BY '\n';"))
        conn.commit()
    engine.dispose()
print("Database populated")

currentUser = None
currentEmail = None

index_name = 'recipe_index'
if not es.indices.exists(index=index_name):
    es.indices.create(index=index_name)

def addToEs():
    with app.app_context():
        recipes = Recipe.query.all()
        i = 1
        for recipe in recipes:
            print("Recipe:",i)
            #print(recipe)
            if not es.exists(index=index_name,id=recipe.id):
                if isinstance(recipe.upload_date,str) == False:
                    es.index(index=index_name, id=recipe.id, body= {'ingredients': recipe.ingredients, 'instructions': recipe.instructions, 'upload_date': recipe.upload_date, 'revised_date': recipe.revised_date, 'title': recipe.title, 'description': recipe.description, 'user_name': recipe.user_name, 'image_name': recipe.image_name})
                else:
                    print(recipe)
            i+=1
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
    if Recipe.query.filter_by(user_name=username1):
        insert_user(username2, User.query.filter_by(username=username1).first().password, User.query.filter_by(username=username1).first().email, User.query.filter_by(username=username1).first().privilege)
        recipes = Recipe.query.filter_by(user_name=username1)
        for r in recipes:
            r.user_name = username2
        db.session.commit()
    else:
        user = User.query.filter_by(username=username1).first()
        user.username = username2
        db.session.commit()

def update_password(username1, password2):
    hashedPass = sha256(password2.encode('utf-8')).hexdigest()
    user = User.query.filter_by(username=username1).first()
    user.password = hashedPass
    db.session.commit()

def update_email(username1, email2):
    user = User.query.filter_by(username=username1).first()
    user.email = email2
    db.session.commit()

def insert_recipe(title1, description1, upload_date1, revised_date1, image_name1, user_name1, ingredients1, instructions1):
    recipe = Recipe(title=title1, description=description1, ingredients=ingredients1, instructions=instructions1, upload_date=upload_date1, revised_date=revised_date1, image_name=image_name1, user_name=user_name1)
    
    db.session.add(recipe)
    
    db.session.commit()
    if not es.exists(index=index_name,id=recipe.id):
                if isinstance(recipe.upload_date,str) == False:
                    es.index(index=index_name, id=recipe.id, body= {'ingredients': recipe.ingredients, 'instructions': recipe.instructions, 'upload_date': recipe.upload_date, 'revised_date': recipe.revised_date, 'title': recipe.title, 'description': recipe.description, 'user_name': recipe.user_name, 'image_name': recipe.image_name})
                else:
                    print(recipe)

def insert_image(image_name1, image_data1):
    if image_name1 != None:
        image = Image(image_name=image_name1, data=image_data1)
        db.session.add(image)
        db.session.commit()

def delete_image(image_name1):
    if image_name1:
        Image.query.filter_by(image_name=image_name1).delete()
        db.session.commit()

def delete_recipe(id1):
    recipe = Recipe.query.filter_by(id=id1).first()
    image = recipe.image_name
    recipe.image_name = None
    Image.query.get(image).delete()
    Recipe.query.filter_by(id=id1).delete()
    db.session.commit()

def update_title(id1, title1):
    recipe = Recipe.query.filter_by(id=id1).first()
    recipe.title = title1
    db.session.commit()

def update_description(id1, description1):
    recipe = Recipe.query.filter_by(id=id1).first()
    recipe.description = description1
    db.session.commit()

def update_ingredients(id1, ingredients1):
    recipe = Recipe.query.filter_by(id=id1).first()
    recipe.ingredients = ingredients1
    db.session.commit()

def update_instructions(id1, instructions1):
    recipe = Recipe.query.filter_by(id=id1).first()
    recipe.instructions = instructions1
    db.session.commit()

def update_revisedDate(id1, revisedDate1):
    recipe = Recipe.query.filter_by(id=id1).first()
    recipe.revisedDate = revisedDate1
    db.session.commit()

def update_image(id1, image_name1, image_name2, image_data1):
    recipe = Recipe.query.filter_by(id=id1).first()
    if Image.query.get(image_name2) == None:
        insert_image(image_name2, image_data1)
    recipe.image_name = image_name2
    if Image.query.get(image_name1) != None:
        delete_image(image_name1)
    db.session.commit()


@app.route("/")
def home():
    return 


@app.route('/search', methods = ['POST'])
def search():
    search_query = request.json
    print(request.json)
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
        search_results = es.search(index='recipe_index', body=search_body,request_timeout=60)
        recipes = [{'id': hit['_id'], **hit['_source']} for hit in search_results['hits']['hits']]
        for recipe in recipes:
            recipe["ingredients"] = recipe["ingredients"].replace("'|| '", ", ").replace("\"`['", "").replace("']`\"", "").replace("`", "")
            recipe["ingredients"] = recipe["ingredients"].replace("||", ",")
            recipe["instructions"] = recipe["instructions"].replace("||", ",").replace("\"`", "").replace("`\"", "")
        print(recipes)
        return jsonify({"search" : recipes})


#app route that deals with the insertion of a user
@app.route("/create_user", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def createUser():
    username = request.json['username']
    password = request.json['password']
    email = request.json['email']

    if User.query.get(username) == None:
        insert_user(username, password, email, 0)
        return {"status": 1}
    else:
        return {"status": 0}

#app route that deals with the deletion of a user
@app.route("/delete_user", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def deleteUser():
    global currentUser
    global currentEmail
    getAccount = request.json['username']
    account = User.query.get(currentUser)
    if account.privilege == 1 and getAccount != currentUser:
        account = User.query.get(getAccount)
    if account.privilege != 1 and Recipe.query.filter_by(user_name=account.username) and account != None:
        recipes = Recipe.query.filter_by(user_name=account.username)
        for r in recipes:
            delete_recipe(r.id)
        delete_user(account.username)
        if currentUser == account.username:
            currentUser = None
            currentEmail = None
        return {"status": 1}
    elif account.privilege != 1 and account != None:
        delete_user(account.username)
        if currentUser == account.username:
            currentUser = None
            currentEmail = None
        return {"status": 1}
    else:
        return {"status": 0}
    

#app route that deals with user login
@app.route("/login", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def login():
    global currentUser
    global currentEmail
    username = request.json['username']
    password = request.json['password']
    password = sha256(password.encode('utf-8')).hexdigest()
    if User.query.get(username) != None:
        account = User.query.get(username).password
        if account == password:
            currentUser = username
            currentEmail = User.query.get(username).email
            if User.query.get(username).privilege == 1:
                return {"status": 2}
            return {"status": 1}
    return {"status": 0}

#app route that determines whether or not a user is logged in
@app.route("/status", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def status():
    global currentUser
    print(currentUser)
    if currentUser != None and User.query.get(currentUser).privilege == 1:
        return {"login": 2}
    elif currentUser != None:
        return {"login": 1}
    else:
        return {"login": 0}
    
#app route that logs out the user
@app.route("/logout", methods = ['GET'])
@cross_origin(supports_creditals=True, origin="*")
def logout():
    global currentUser
    global currentEmail
    if currentUser:
        currentUser = None
        currentEmail = None
    print(currentUser)
    return {"status": 0}

#app route that deals with editing a user's username
@app.route("/edit_username", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def editUsername():
    global currentUser
    print(currentUser)
    username = request.json['newUsername']
    if currentUser != None and User.query.get(username) == None and User.query.get(currentUser) != None:
        update_username(currentUser, username)
        currentUser = username
        return {"status": 1}
    else:
        return {"status": 0}

#app route that deals with editing a user's password
@app.route("/edit_password", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def editPassword():
    global currentUser
    password = request.json['newPassword']
    if currentUser != None and password != None and User.query.get(currentUser) != None:
        update_password(currentUser, password)
        return {"status": 1}
    else:
        return {"status": 0}
    
#app route that deals with editing a user's email
@app.route("/edit_email", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def editEmail():
    global currentEmail
    global currentUser
    email = request.json['newEmail']
    if currentUser != None and email != None and User.query.get(currentUser) != None:
        update_email(currentUser, email)
        currentEmail = email
        return {"status": 1}
    else:
        return {"status": 0}

#app route that deals with displaying a user's details
@app.route("/display_user", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayUser():
    global currentUser
    global currentEmail
    if currentUser:
        return {"username": currentUser, "email": currentEmail, "login": 1}
    else:
        return {"username": "", "email": "", "login": 0}
    

#app route that deals with the upload of a recipe
@app.route("/upload_recipe", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def uploadRecipe():
    global currentUser
    title = request.json['title']
    description = request.json['description']
    ingredients = request.json['ingredients']
    instructions = request.json['instructions']
    image_name = request.json['image_name']
    user_name = currentUser
    if user_name != None and title != None and ingredients != None and instructions != None and User.query.get(user_name) != None:
        insert_recipe(title, description, datetime.datetime.now(timezone.utc), datetime.datetime.now(timezone.utc), image_name, user_name, ingredients, instructions)
        return {"status": 1}
    else:
        return {"status": 0}
    
#app route that deals with the upload of an image
@app.route("/upload_image", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def uploadImage():
    image_name = request.form['image_name']
    file = request.files['imageData']
    image_data = file.read()
    if image_name != None and file != None:
        insert_image(image_name, image_data)
        return {"status": 1}
    else:
        return {"status": 0}

#app route that deals with the deletion of a recipe
@app.route("/delete_recipe", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def deleteRecipe():
    global currentUser
    id = request.json['id']
    image = Recipe.query.get(id).image_name
    if id != None and (Recipe.query.get(id).user_name == currentUser or User.query.get(currentUser).privilege == 1):
        delete_recipe(id)
        return {"status": 1}
    else:
        return {"status": 0}
    
#app route that deals with the editing of a recipe
@app.route("/edit_recipe", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def editRecipe():
    id = request.json['id']
    title = request.json['newTitle']
    description = request.json['newDescription']
    ingredients = request.json['newIngredients']
    instructions = request.json['newInstructions']
    if id != None and title != None and title != "":
        update_title(id, title)
    if id != None and ingredients != None and ingredients != "":
        print(ingredients)
        update_ingredients(id, ingredients)
    if id != None and instructions != None and instructions != "":
        update_instructions(id, instructions)
    if id != None and description != None and description != "":
        update_description(id, description)
    if id == None:
        return {"status": 0}
    else:
        update_revisedDate(id, datetime.datetime.now(timezone.utc))
        return {"status": 1}

#app route that edits recipe image 
@app.route("/edit_image", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def editImage():
    id = request.form['id']
    image_nameOld = request.form['oldImage_name']
    image_nameNew = request.form['image_name']
    image_data = request.files['imageData']
    image_data = image_data.read()
    if image_nameOld != None or image_nameOld != "":
        update_image(id, image_nameOld, image_nameNew, image_data)
        update_revisedDate(id, datetime.datetime.now(timezone.utc))
        return {"status": 1}
    else:
        return {"status": 0}

#app route that displays a specific recipe
@app.route("/recipe", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayRecipe():
    id = request.json['id']
    recipe = Recipe.query.get(id)
    ingredients = recipe.ingredients.replace("'|| '", ", ").replace("\"`['", "").replace("']`\"", "").replace("`", "")
    ingredients = ingredients.replace("||", ",")
    instructions = recipe.instructions.replace("||", ",").replace("\"`", "").replace("`\"", "")
    return {"id": recipe.id, "title": recipe.title, "description": recipe.description, "ingredients": ingredients, "instructions": instructions, "username": recipe.user_name, "upload_date": recipe.upload_date, "revised_date": recipe.revised_date, "image_name": recipe.image_name}

#app route that displays a specific image
@app.route("/display_image", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def getImage():
    id = request.json['id']
    return Image.query.get(Recipe.query.get(id).image_name).data

#app route that displays a specific image
@app.route("/image", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayImage():
    if request.method == 'GET':
        return Image.query.get(Recipe.query.get(2).image_name).data
    elif request.method == 'POST':
        return Image.query.get(Recipe.query.get(request.json).image_name).data

#app route that displays the recipe of the day
@app.route("/recipeOTD", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayRecipeOTD():
    recipe = Recipe.query.get(2)
    ingredients = recipe.ingredients.replace("'|| '", ", ").replace("\"`['", "").replace("']`\"", "").replace("`", "")
    ingredients = ingredients.replace("||", ",")
    instructions = recipe.instructions.replace("||", ",").replace("\"`", "").replace("`\"", "")
    return {"id": recipe.id, "title": recipe.title, "description": recipe.description, "ingredients": ingredients, "instructions": instructions, "username": recipe.user_name, "upload_date": recipe.upload_date, "revised_date": recipe.revised_date, "image_name": recipe.image_name}

#app route that displays the image for the recipe of the day
@app.route("/imageOTD", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayImageOTD():
    return Image.query.get(Recipe.query.get(2).image_name).data

#app route that displays user recipes
@app.route("/user_recipes", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayRecipes():
    global currentUser
    recipe = Recipe.query.filter_by(user_name=currentUser).limit(1000).all()
    if User.query.get(currentUser).privilege == 1:
        recipes_list = []
        for r in recipe:
            recipes_list.append({
                'id': r.id,
                'title': r.title,
                'description': r.description,
                'ingredients': r.ingredients.replace("'|| '", ", ").replace("\"`['", "").replace("']`\"", "").replace("`", "").replace("||", ","),
                'instructions': r.instructions.replace("||", ",").replace("\"`", "").replace("`\"", ""),
                'image_name': r.image_name
            })
    else:
        recipes_list = []
        for r in recipe:
            recipes_list.append({
                'id': r.id,
                'title': r.title,
                'description': r.description,
                'ingredients': r.ingredients,
                'instructions': r.instructions,
                'image_name': r.image_name
            })
    return jsonify({"recipes": recipes_list})

#app route that displays all users
@app.route("/all_users", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayAllUsers():
    users = User.query.all()
    users_list = []
    for u in users:
        users_list.append({
            'username': u.username,
            'email': u.email
        })
    return jsonify({"users": users_list})

#app route that displays all recipes
@app.route("/all_recipes", methods = ['GET', 'POST'])
@cross_origin(supports_creditals=True, origin="*")
def displayAllRecipes():
    recipes = Recipe.query.all()
    return jsonify({"recipes": recipes})

@app.route('/api/time')
def get_curr_time():
    return {'time': time.time()}

#if __name__ == '__main__':
    #app.run(debug=True)