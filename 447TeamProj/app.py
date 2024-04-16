from flask import Flask, jsonify, request, render_template
from elasticsearch import Elasticsearch
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask import request, redirect
from datetime import datetime

app = Flask(__name__)

usrname = "elastic"
passwd = "123456"
es = Elasticsearch(['https://localhost:9200'], verify_certs=False, http_auth=(usrname, passwd))

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://indProj:1234@localhost/test447'

db = SQLAlchemy(app)

class Recipe(db.Model):
    id = db.Column('recipe_id', db.Integer, primary_key=True, autoincrement=True)
    ingredients = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    instructions = db.Column(db.String(10000), nullable = False)
    upload_date = db.Column(db.Date)


with app.app_context():
    db.create_all()

# Sample data to index
sample_Recipes = [
   {"ingredients": "Beef, Onion, Bell pepper, Rice noodles", 
     "Title": "Beef Stir Fry", 
     "Instructions": "Slice beef thinly. Stir-fry with onion and bell pepper. Serve over cooked rice noodles.", 
     "upload_Date": datetime(2022, 4, 8).date()},
    {"ingredients": "Tomato, Mozzarella, Basil", 
     "Title": "Margherita Pizza", 
     "Instructions": "Spread tomato sauce on pizza dough. Add slices of mozzarella and fresh basil leaves. Bake until crust is golden brown.", 
     "upload_Date": datetime(2022, 4, 7).date()},
    {"ingredients": "Chicken breast, Garlic, Lemon, Olive oil", 
     "Title": "Lemon Garlic Chicken Pasta", 
     "Instructions": "Cook pasta according to package instructions. Meanwhile, sauté chicken with garlic and lemon in olive oil. Toss cooked pasta with chicken and serve.", 
     "upload_Date": datetime(2022, 4, 6).date()},
    {"ingredients": "Pork chops, Apple, Cinnamon, Brown sugar", 
     "Title": "Apple Cinnamon Pork Chops", 
     "Instructions": "Season pork chops with cinnamon and brown sugar. Sear in a skillet, then bake with sliced apples until pork is cooked through.", 
     "upload_Date": datetime(2022, 4, 5).date()},
    {"ingredients": "Chicken breast, Garlic, Lemon, Olive oil", 
     "Title": "Lemon Garlic Chicken", 
     "Instructions": "Marinate chicken in minced garlic, lemon juice, and olive oil. Grill until cooked through.", 
     "upload_Date": datetime(2022, 4, 4).date()},
    {"ingredients": "Tomato, Mozzarella, Basil", 
     "Title": "Caprese Salad", 
     "Instructions": "Slice tomatoes and mozzarella. Arrange them on a plate. Add basil leaves. Drizzle with olive oil and balsamic vinegar.", 
     "upload_Date": datetime(2022, 4, 3).date()},
    {"ingredients": "Beef, Onion, Bell pepper, Rice noodles", 
     "Title": "Beef Stir Fry", 
     "Instructions": "Slice beef thinly. Stir-fry with onion and bell pepper. Serve over cooked rice noodles.", 
     "upload_Date": datetime(2022, 4, 2).date()},
    {"ingredients": "Tomato, Mozzarella, Basil", 
     "Title": "Margherita Pizza", 
     "Instructions": "Spread tomato sauce on pizza dough. Add slices of mozzarella and fresh basil leaves. Bake until crust is golden brown.", 
     "upload_Date": datetime(2022, 4, 1).date()},
    {"ingredients": "Chicken breast, Garlic, Lemon, Olive oil", 
     "Title": "Lemon Garlic Chicken Pasta", 
     "Instructions": "Cook pasta according to package instructions. Meanwhile, sauté chicken with garlic and lemon in olive oil. Toss cooked pasta with chicken and serve.", 
     "upload_Date": datetime(2022, 3, 31).date()},
    {"ingredients": "Pork chops, Apple, Cinnamon, Brown sugar", 
     "Title": "Apple Cinnamon Pork Chops", 
     "Instructions": "Season pork chops with cinnamon and brown sugar. Sear in a skillet, then bake with sliced apples until pork is cooked through.", 
     "upload_Date": datetime(2022, 3, 30).date()},
]

index_name = 'recipe_index'
if not es.indices.exists(index=index_name):
    es.indices.create(index=index_name)

@app.route('/addToEs')
def addToEs():
    with app.app_context():
        recipes = Recipe.query.all()
        for recipe in recipes:
            es.index(index=index_name, id=recipe.id, body= {'ingredients': recipe.ingredients, 'instructions': recipe.instructions, 'upload_date': recipe.upload_date, 'title': recipe.title})


@app.route('/addToDb')
def addToDb():
     with app.app_context():
        for sample in sample_Recipes:
            checkForData = Recipe.query.filter_by(instructions=sample["Instructions"], title = sample["Title"], ingredients = sample["ingredients"], upload_date = sample["upload_Date"]).first()
            if checkForData:
                continue
            else:
                recipe = Recipe(instructions = sample["Instructions"],title = sample["Title"],ingredients = sample["ingredients"] , upload_date = sample["upload_Date"])
                db.session.add(recipe)
                db.session.commit()

addToEs()
addToDb()

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search')
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
        print("Search Query:", search_body)  # Print search query for debugging
        search_results = es.search(index='recipe_index', body=search_body)
        recipes = [{'id': hit['_id'], **hit['_source']} for hit in search_results['hits']['hits']]
        print("Search Results:", recipes)
        return render_template('index.html', recipes=recipes)
    else:
        return render_template('index.html')


@app.route("/recipe/<int:recipe_id>")
def recipeFunc(recipe_id):
    print(recipe_id)
    #return("id is ", recipe_id)
    recipe = Recipe.query.get(recipe_id)
    if recipe:
        print(recipe_id)
        return render_template('recipe.html', recipe=recipe)
    else:
        print("nothing there")
        return "Recipe not found"

if __name__ == '__main__':
    app.run(debug=True)
