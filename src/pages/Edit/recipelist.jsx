import { useState, useEffect } from "react";
import { Table } from "./myTable"

export const RecipeList = () => {
    const [recipes, setRecipes] = useState({recipes: []});

    function FetchData() {
        useEffect(() => {
            fetch("/user_recipes").then((res) => 
            res.json().then((data) => {
                    setRecipes({
                        recipes: data.recipes
                    })
                })
            );
        }, []);
    }

    FetchData();
    
    return (
        <div>
            <Table rows={recipes}/>
        </div>
    )
    
}


export default RecipeList;