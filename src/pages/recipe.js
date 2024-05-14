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
        <div className="Indiv_Recipe">
            <img src={dataImage[specific_recipe.state.recipe.id]} alt="Missing Recipe Image" className = "RecipeImage" style = {{width:"100vw", height: "338px", objectFit: "cover",filter: "blur(10px)",position:"absolute"}}></img>
            <h2 className="indiv" >{specific_recipe.state.recipe.title}</h2>
            


            <h2 style = {{top: "47%", left: "2%",position:"absolute",textDecoration: "underline", textDecorationColor:"#fdb515",fontSize: "30px"}}>Ingredients</h2>
            <p style={{ top: "47%", left: "2%",width: "350px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:20,borderRight:"solid", paddingRight:"10px", paddingBottom:"20px",fontSize: "18px"}}>{specific_recipe.state.recipe.ingredients}</p>

            <h2 style = {{top: "47%", left: "500px",width:"30vw", height: "169px",display:"inline-block",position:"absolute",textDecoration: "underline", textDecorationColor:"#fdb515",fontSize: "30px"}}>Instructions</h2>
            <p style={{ top: "47%", left: "500px",width: "70vw", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:20,borderRight:"solid", paddingRight:"10px", paddingBottom:"20px",fontSize: "18px"}}>{specific_recipe.state.recipe.instructions}</p>
        </div>
        </div>
    );
}

export default Recipe;