import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"



class Toolbar extends React.Component {

  constructor() {
    super();
  }

  

  //three text boxes and a button
  render() {
    return (
      <ul class = "Toolbar">
        <li class = "toolbar"style={{float : "left"}}><a class = "toolbar" href="#signup">Sign Up</a></li>
        <li class = "toolbar"style={{float : "left"}}><a class = "login" href="#login">Log In</a></li>
        <li class = "toolbar"><a href="" style={{padding : 0,borderWidth:0}}> <img src={require('./Logo.png')} alt="RecipeRetrieverLogo" style={{width:"443", height:"50",marginRight:-175}}/></a></li>
        <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#user_recipes">User Recipes</a> </li>
        <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#account_details">Account Details</a> </li>
        <li class = "toolbar" style={{float : "right"}}><a class="toolbar" href="#account_details" style={{float : "right", padding: "5 8", borderRadius:10}}><img src={require('./profile.png')} alt="Profile Pic" style={{width:"30", height:"30"}}/></a></li>
      </ul>
      
      
    );
  }
}





class Recipe_OTD extends React.Component {

  constructor() {
    super();
  }

  

  //three text boxes and a button
  render() {
    return (
      <div>
        <div class="margin">
          <h1>Recipe of the Day</h1>
        </div>
        <div class="ROTD">
          <img src={require("./archive/Food Images/Food Images/thanksgiving-mac-and-cheese-erick-williams.jpg")} alt="Missing Recipe Image" style = {{width:"274px", height: "169px", objectFit: "cover",display:"inline-block",borderRight:"solid",borderWidth:"2px"}}></img>
          <h1 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,textDecoration:"underline"}}>Thanksgiving Mac and Cheese</h1>
          <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,marginTop:45}}>Ingredients</h3>
          <ul style={{ position:"absolute", display:"inline-block",marginTop:75,marginLeft:20}}>
            <li>1 cup evaporated milk</li>
            <li>1 cup whole milk</li>
            <li>1 tsp. garlic powder</li>
            <li>...</li>
          </ul>
          <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:"20vw",marginTop:45}}>Instructions</h3>
          <ul style={{ position:"absolute", display:"inline-block",marginTop:75,marginLeft:"20vw"}}>
            <li>Place a rack in middle of oven; preheat to 400°.</li>
            <li>Bring evaporated milk and whole milk to a bare simmer in a large saucepan over medium heat.</li>
            <li>...</li>
          </ul>
        </div>
      </div>
      
    );
  }
}


class SearchBar extends React.Component {

  constructor() {
    super();

    this.state = {ID: ''};

    this.update_ID = this.update_ID.bind(this);
    this.submit = this.submit.bind(this)
  }

  update_ID(event) {
    this.setState({ID: event.target.value});
  }



  submit(event) {
    this.setState({ID: ''})
    event.preventDefault();
  }

  render() {
    return (
      <div class="search">
      <div class="margin" style = {{marginTop:"10vh"}}>
      </div>
      <form onSubmit={this.submit}>
        <h2 style = {{textDecoration: "underline", textDecorationColor: "#fdb515"}}>
        Not feeling the recipe of the day? Search for another delicious recipe!
        </h2>
        <label>
          <input class = "searchbar" type="text" value={this.state.ID} onChange={this.update_ID} />
        </label>
        <input class="coolbutton" type="submit" value="Search" />
      </form>
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
IOTD.render(<Ingredient_OTD />);


