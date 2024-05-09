import {useLocation} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';

export const Recipe = () => {

    const specific_recipe = useLocation();

    const [dataImage, setDataImage] = useState({});


    function useImage() {
        useEffect(()=>{

                fetch("/image", {method:"POST", headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                  }, body: JSON.stringify(specific_recipe.state.recipe.id)}).then((res) => 
                res.blob().then((data1) => {
                        dataImage[specific_recipe.state.recipe.id] = URL.createObjectURL(data1)
                        setDataImage({...dataImage});
                    })
                );


                console.log(dataImage);
        } ,[])
    };


    useImage();

    return(
        <div>

        <div>
        <div class="margin">
        </div>
        <div className="ROTD">
            <img src={dataImage[specific_recipe.state.recipe.id]} alt="Missing Recipe Image" style = {{width:"274px", height: "169px", objectFit: "cover",display:"inline-block",borderRight:"solid",borderWidth:"2px"}}></img>
            <h2 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,textDecoration:"underline"}} >{specific_recipe.state.recipe.title}</h2>


            <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,marginTop:45}}>Ingredients</h3>
            <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:20}}>
            <li>{specific_recipe.state.recipe.ingredients}</li>
            </ul>

            <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:"20vw",marginTop:45}}>Instructions</h3>
            <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:"20vw"}}>
            <li>{specific_recipe.state.recipe.instructions}</li>
            </ul>
        </div>
        </div>
    )))
        </div>
    );
}

export default Recipe;