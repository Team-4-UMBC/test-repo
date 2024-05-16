import React from "react";

import "./recipelist.css";
import DropdownDeleteRecipe from "../../components/Dropdown/DropdownDeleteRecipe";
import DropdownTableEdit from "../../components/Dropdown/DropdownTableEdit";

export const Table = ({ rows }) => {
    return(
        <div className="start">         
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th className="expand">Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(recipe => (
                                <tr>
                                <td>
                                    {recipe.id}
                                </td>
                                <td>
                                    {recipe.title}
                                </td>
                                <td className="expand">
                                    {recipe.Description}
                                </td>
                                <td className="fit">
                                    <span className="actions">
                                        <DropdownTableEdit buttonText="" content="" myRecipe={recipe}/>
                                        <DropdownDeleteRecipe buttonText="" content="" recipe={recipe}/>
                                    </span>
                                </td>
                            </tr>
                            ))} 
                        </tbody>
                    </table>
                    
            </div>  
    )
}