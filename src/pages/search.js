import {useLocation} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';

export const Search = () => {

    const search_state = useLocation();

    const [dataImage, setDataImage] = useState({});


    function useImage() {
        useEffect(()=>{
            console.log(search_state.state.recipes.length);
            for(let i = 0; i < search_state.state.recipes.length; i++) {
                let obj = search_state.state.recipes[i];
            
                fetch("/image", {method:"POST", headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                  }, body: JSON.stringify(obj.id)}).then((res) => 
                res.blob().then((data1) => {
                        dataImage[obj.id] = URL.createObjectURL(data1)
                        setDataImage({...dataImage});
                    })
                );

                console.log(obj.id);
                console.log(dataImage);
            }
        } ,[])
    };

    const navigate = useNavigate();
    function LoadIndividual(this_recipe){
        console.log(this_recipe.id);
        navigate('/recipe',{"state":{"recipe":this_recipe}})
    };


    useImage();

    console.log(search_state)
    return(
        <div>
            <h1 style={{textDecoration: "underline", textDecorationColor: "#fdb515", display: "inline-block"}}>Search Results For {search_state.state.search_term}</h1>
        {(typeof search_state.state.recipes == 'undefined') ? (
        <p>Loading...</p>
        ) : (
            search_state.state.recipes.map((recipe, i) => (
            <div>
            <div class="margin">
            </div>
            <div className="ROTD_search" onClick={() => LoadIndividual(recipe)} style={{transition: "box shadow .3s"}}>
                <img src={dataImage[recipe.id]} alt="Missing Recipe Image" style = {{width:"274px", height: "169px", objectFit: "cover",display:"inline-block",borderRight:"solid",borderWidth:"2px"}}></img>
                <h2 style = {{width:"40vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,textDecoration:"underline"}} >{recipe.title}</h2>

    
                <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,marginTop:45}}>Ingredients</h3>
                <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:20}}>
                <li>{recipe.ingredients}</li>
                </ul>
    
                <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:"20vw",marginTop:45}}>Instructions</h3>
                <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:"20vw"}}>
                <li>{recipe.instructions}</li>
                </ul>
            </div>
            </div>
        )))}
        </div>
    );
}

export default Search;