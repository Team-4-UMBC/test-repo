import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Dropdown from './components/Dropdown/Dropdown';
import DropdownCreate from './components/Dropdown/DropdownCreate';
import DropdownEdit from './components/Dropdown/DropdownEdit';
import Upload from './pages/upload/upload';
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Search from "./pages/search.js"
import {Link, useNavigate} from 'react-router-dom';
import Recipe from "./pages/recipe.js"


export function Toolbar() {


  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    setOpen((open) => !open);
    return fetch('http://localhost:5000/status', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then((res) => 
            res.json().then((data) => {
                setLogin(data.login);
            })
        );
  }

  const logout = () => {
    return fetch('http://localhost:5000/logout', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then((res) => 
            res.json().then((data) => {
                setLogin(data.status);
            })
        );
  }


  //three text boxes and a button
    return (
        <ul class = "Toolbar">
          {!login ? <li class = "toolbar"style={{float : "right"}}><Dropdown buttonText="Log In " content = "" click={handleLogin} open={open}/></li> : null}
          {login ? <li class = "toolbar" style={{float : "left"}}><a class="toolbar" onClick={logout}>Log Out</a> </li> : <li class = "toolbar"style={{float : "left"}}><DropdownCreate buttonText="Sign Up " content = ""/></li> }
          <li class = "toolbar"><a href="/" style={{padding : 0,borderWidth : 0, float : "" }}> <img src={require('./Logo.png')} alt="RecipeRetrieverLogo" style={{width:"443", height:"50",marginRight:-50}}/></a></li>
          {login ? <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#user_recipes">User Recipes</a> </li> : null}
          {login ? <li class = "toolbar" style={{float : "right"}}><Link to='/upload' class="toolbar">Upload Recipe</Link></li> : null}
          {login ? <li class = "toolbar"style={{float : "left"}}><DropdownEdit buttonText="Account Details " content = ""/></li> : null}
        </ul>
    );
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

  const navigate = useNavigate();
  function LoadIndividual(this_recipe){
      console.log(this_recipe.id);
      navigate('/recipe',{"state":{"recipe":this_recipe}})
  };

  //three text boxes and a button
  return (
      <div>
        <div class="margin">
          <h1>Recipe of the Day</h1>
        </div>
        <div className="ROTD" onClick={() => LoadIndividual(dataRecipe)}>
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
              navigate('/search',{"state":{"recipes":data.search,"search_term":JSON.stringify(document.getElementById("RecipeSearch").value)}});
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


export function Ingredient_OTD() {

  const [state, setState] = useState({
    recipes: []
  });

  const navigate = useNavigate();

  const IOTD_submit = (event) => {
      fetch("/search", {method:"POST", headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }, body: JSON.stringify("Chicken")}).then(res => res.json().then(
        (data) => {
              setState({
                recipes: data.search
              });
              navigate('/search',{"state":{"recipes":data.search,"search_term":JSON.stringify("Chicken")}});
              //toSearch();
          }));
      event.preventDefault();
  }



  //three text boxes and a button
    return (
      <div>
        <div class="margin" style = {{marginTop:"15vh"}}>
          <h2 style={{textDecoration: "underline"}}>Ingredient of the Day</h2>
        </div>
        <div class="IOTD">
          <h3 style={{textDecoration: "underline", textDecorationColor: "#fdb515", display: "inline-block"}}>Chicken!</h3>
          <form onSubmit={IOTD_submit} style = {{display: "inline-block"}}>
            <input class= "lesscoolbutton" type="submit" value="Search for recipes with Chicken!" />
          </form>
        </div>
      </div>

    );
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
  {
    path: "recipe",
    element: <><Toolbar/><Recipe/></>,
  },
  {
    path: "upload",
    element: <><Toolbar/><Upload/></>
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<RouterProvider router={router} />);

