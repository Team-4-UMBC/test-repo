import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Dropdown from './components/Dropdown/Dropdown';
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Search from "./pages/search.js"
import {Link, useNavigate} from 'react-router-dom';


export class Toolbar extends React.Component {

  constructor() {
    super();
  }



  //three text boxes and a button
  render() {
    return (
      <ul class = "Toolbar">
        <li class = "toolbar"style={{float : "left"}}><a class = "toolbar" href="#signup">Sign Up</a></li>
        <li class = "toolbar"style={{float : "left"}}>
          <Dropdown buttonText="Log In " content = ""/>
        </li>
        <li class = "toolbar"><a href="/" style={{padding : 0,borderWidth:0}}> <img src={require('./Logo.png')} alt="RecipeRetrieverLogo" style={{width:"443", height:"50",marginRight:-175}}/></a></li>
        <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#user_recipes">User Recipes</a> </li>
        <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#account_details">Account Details</a> </li>
        <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#account_details" style={{float : "right", padding: "5 8", borderRadius:10}}><img src={require('./profile.png')} alt="Profile Pic" style={{width:"30", height:"30"}}/></a></li>
      </ul>
    );
  }
}





export function Recipe_OTD() {

  //defines the data to be displayed and fetches it
  const [dataRecipe, setData] = useState({
    id: 0,
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    user_name: "",
    upload_date: "",
    revised_date: "",
    image_name: "",
  });
  const [dataImage, setDataImage] = useState();
  useEffect(() => {
      fetch("/recipe").then((res) => 
      res.json().then((data) => {
              setData({
                id: data.id,
                title: data.title,
                description: data.description,
                ingredients: data.ingredients,
                instructions: data.instructions,
                user_name: data.user_name,
                upload_date: data.upload_date,
                revised_date: data.revised_date,
                image_name: data.image_name
              });
          })
      );
  }, []);
  useEffect(() => {
    fetch("/image").then((res) => 
    res.blob().then((data1) => {
            setDataImage(URL.createObjectURL(data1));
        })
    );
}, []);

  //three text boxes and a button
  return (
      <div>
        <div class="margin">
          <h1>Recipe of the Day</h1>
        </div>
        <div className="ROTD">
          <img src={dataImage} alt="Missing Recipe Image" style = {{width:"274px", height: "169px", objectFit: "cover",display:"inline-block",borderRight:"solid",borderWidth:"2px"}}></img>
          <h2 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,textDecoration:"underline"}}>{dataRecipe.title}</h2>


          <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,marginTop:45}}>Ingredients</h3>
          <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:20}}>
            <li>{dataRecipe.ingredients}</li>
          </ul>

          <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:"20vw",marginTop:45}}>Instructions</h3>
          <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:"20vw"}}>
            <li>{dataRecipe.instructions}</li>
          </ul>
        </div>
      </div>

    );
}


export function SearchBar() {
  const [state, setState] = useState({
    recipes: []
  });

  const navigate = useNavigate();

  const submit = (event) => {
      fetch("/search", {method:"POST", headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }, body: JSON.stringify(document.getElementById("RecipeSearch").value)}).then(res => res.json().then(
        (data) => {
              setState({
                recipes: data.search
              });
              navigate('/search',{"state":{"recipes":data.search}});
              //toSearch();
          }));
      event.preventDefault();
  }


  
  //const toSearch=()=>{
    //navigate('/search',{"state":{"recipes":state.recipes}});
      //}

  return (
    <div class="search">
    <div class="margin" style = {{marginTop:"10vh"}}>
    </div>
    <form onSubmit={submit}>
      <h2 style = {{textDecoration: "underline", textDecorationColor: "#fdb515"}}>
      Not feeling the recipe of the day? Search for another delicious recipe!
      </h2>
      <label>
        <input class = "searchbar" type="text" id = "RecipeSearch"/>
      </label>
      <input class="coolbutton" type="submit" value="Search" />
    </form>
    {(typeof state.recipes == 'undefined') ? (
        <p>Loading...</p>
        ) : (
        state.recipes.map((recipe, i) => (
          <p style = {{width:"30vw", height: "169px"}} key={i}>{recipe.title}</p>
    )))}
    </div>
  );
}


export class Ingredient_OTD extends React.Component {

  constructor() {
    super();
  }



  //three text boxes and a button
  render() {
    return (
      <div>
        <div class="margin" style = {{marginTop:"15vh"}}>
          <h2 style={{textDecoration: "underline"}}>Ingredient of the Day</h2>
        </div>
        <div class="IOTD">
          <h3 style={{textDecoration: "underline", textDecorationColor: "#fdb515", display: "inline-block"}}>Chicken!</h3>
          <form onSubmit={this.Ingredient} style = {{display: "inline-block"}}>
            <input class= "lesscoolbutton" type="submit" value="Search for recipes with Chicken!" />
          </form>
        </div>
      </div>

    );
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Toolbar/><Recipe_OTD/><SearchBar/><Ingredient_OTD/></>,
  },
  {
    path: "search",
    element: <><Toolbar/><Search/></>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<RouterProvider router={router} />);

/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Toolbar />);
const ROTD = ReactDOM.createRoot(document.getElementById('ROTD'));
ROTD.render(<Recipe_OTD />);
const Search = ReactDOM.createRoot(document.getElementById('SearchBar'));
Search.render(<SearchBar />);
const IOTD = ReactDOM.createRoot(document.getElementById('IOTD'));
IOTD.render(<Ingredient_OTD />);*/

//render all of the DOM elements created


/*import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Dropdown, status } from './components/Dropdown/Dropdown';
import DropdownCreate from './components/Dropdown/DropdownCreate';
import DropdownEditAcct from './components/Dropdown/DropdownCreate';
import "./index.css";
import create from 'zustand';


function Toolbar() {
  const { login } = status.getState();
  //const [status, setStatus] = useState({login: 0})
  

  useEffect(() => {
    window.onbeforeunload = function() {
        return true;
    };

    return () => {
        window.onbeforeunload = null;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    set({login: 1});
  }
  
  //three text boxes and a button
    if(login === 0) {
      return (
        <ul class = "Toolbar">
          
          <li class = "toolbar"style={{float : "left"}}>
            <DropdownCreate buttonText="Create Account " content = ""/>
          </li>
          <li class = "toolbar"style={{float : "left"}}>
            <Dropdown buttonText="Log In " content = ""/>
          </li>
        </ul>
      );
    }
    else if(login === 1) {
      return (
        <ul class = "Toolbar">
          <li class = "toolbar"style={{float : "left"}}>
            <DropdownEditAcct buttonText="Account Details " content = ""/>
          </li>
          <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#user_recipes">User Recipes</a> </li>
        </ul>
      );
    }

}





function Recipe_OTD() {
  
  //defines the data to be displayed and fetches it
  const [dataRecipe, setData] = useState({
    id: 0,
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    user_name: "",
    upload_date: "",
    revised_date: "",
    image_name: "",
  });
  const [dataImage, setDataImage] = useState();
  useEffect(() => {
      fetch("/recipeOTD").then((res) => 
      res.json().then((data) => {
              setData({
                id: data.id,
                title: data.title,
                description: data.description,
                ingredients: data.ingredients,
                instructions: data.instructions,
                user_name: data.user_name,
                upload_date: data.upload_date,
                revised_date: data.revised_date,
                image_name: data.image_name
              });
          })
      );
  }, []);
  useEffect(() => {
    fetch("/imageOTD").then((res) => 
    res.blob().then((data1) => {
            setDataImage(URL.createObjectURL(data1));
        })
    );
}, []);

  //three text boxes and a button
  return (
      <div>
        <div class="margin">
          <h1>Recipe of the Day</h1>
        </div>
        <div className="ROTD">
          <img src={dataImage} alt="Missing Recipe Image" style = {{width:"274px", height: "169px", objectFit: "cover",display:"inline-block",borderRight:"solid",borderWidth:"2px"}}></img>
          <h2 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,textDecoration:"underline"}}>{dataRecipe.title}</h2>
          
          
          <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,marginTop:45}}>Ingredients</h3>
          <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:20}}>
            <li>{dataRecipe.ingredients}</li>
          </ul>
          
          <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:"20vw",marginTop:45}}>Instructions</h3>
          <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:"20vw"}}>
            <li>{dataRecipe.instructions}</li>
          </ul>
        </div>
      </div>
      
    );
}


function SearchBar() {
  const [state, setState] = useState({
    recipes: []
  });

  const submit = (event) => {
      fetch("/search").then((res) => 
      res.json().then((data) => {
              setState({
                recipes: data.recipes
              });
          })
      );
    event.preventDefault();
  }

  return (
    <div class="search">
    <div class="margin" style = {{marginTop:"10vh"}}>
    </div>
    <form onSubmit={submit}>
      <h2 style = {{textDecoration: "underline", textDecorationColor: "#fdb515"}}>
      Not feeling the recipe of the day? Search for another delicious recipe!
      </h2>
      <label>
        <input class = "searchbar" type="text"/>
      </label>
      <input class="coolbutton" type="submit" value="Search" />
    </form>
    {(typeof state.recipes == 'undefined') ? (
        <p>Loading...</p>
        ) : (
        state.recipes.map((recipe, i) => (
          <p style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-10,marginLeft:5}} key={i}>{recipe.title}</p>
    )))}
    <h3 style={{display: "inline-block"}}>I am ...</h3>
    <form onSubmit={this.vegetarian} style = {{display: "inline-block"}}>
      <input class= "lesscoolbutton" style={{backgroundColor:"#74C365"}} type="submit" value="Vegetarian" />
    </form>
    <form onSubmit={this.vegan} style = {{display: "inline-block"}}>
      <input class= "lesscoolbutton" style={{backgroundColor:"#F85050"}} type="submit" value="Vegan" />
    </form>
    <form onSubmit={this.glutenFree} style = {{display: "inline-block"}}>
      <input class= "lesscoolbutton" style={{backgroundColor:"#EFCCA2"}} type="submit" value="Gluten Free" />
    </form>
    </div>
  );
}


class Ingredient_OTD extends React.Component {

  constructor() {
    super();
  }

  

  //three text boxes and a button
  render() {
    return (
      <div>
        <div class="margin" style = {{marginTop:"15vh"}}>
          <h2 style={{textDecoration: "underline"}}>Ingredient of the Day</h2>
        </div>
        <div class="IOTD">
          <h3 style={{textDecoration: "underline", textDecorationColor: "#fdb515", display: "inline-block"}}>Chicken!</h3>
          <form onSubmit={this.Ingredient} style = {{display: "inline-block"}}>
            <input class= "lesscoolbutton" type="submit" value="Search for recipes with Chicken!" />
          </form>
        </div>
      </div>
      
    );
  }
}




//render all of the DOM elements created
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Toolbar />);
const ROTD = ReactDOM.createRoot(document.getElementById('ROTD'));
ROTD.render(<Recipe_OTD />);
const Search = ReactDOM.createRoot(document.getElementById('SearchBar'));
Search.render(<SearchBar />);
const IOTD = ReactDOM.createRoot(document.getElementById('IOTD'));
IOTD.render(<Ingredient_OTD />);*/