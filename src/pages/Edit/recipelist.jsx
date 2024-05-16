import { useState } from "react";
import { Table } from "./myTable"

const RecipeList = () => {

    const sample = [
        {
            "id": 1,
            "title": "Chicken",
            "Description": "My Chicken Recipe",
            "author": "Thomas",
            "Ingredients": "Eggs, Chicken",
            "Instructions": "Cook for 20 minutes",
            "Image": "some Image"
        },
        {
            "id": 2,
            "title": "Beef",
            "Description": "My Beef Recipe",
            "author": "Michael",
            "Ingredients": "Eggs, Beef",
            "Instructions": "Cook for 5 hours",
            "Image": "another Image"
        }
    ]

    const [data, setData] = useState(sample);
    /**
     * INSERT API CALLS HERE
     * Look at how sample array is used to see what I think is presented.
     * 
     * data gets passed into Table and the Table presents 3 things:
     *  id
     *  title
     *  Description
     * If you want to change any of these it will be in the myTable.jsx file
     * 
     * 
     */

    return (
        <div>
            <Table rows={data}/>
        </div>
    )
    
}




export default RecipeList;