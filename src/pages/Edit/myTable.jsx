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
                            {(typeof rows.recipes == 'undefined') ? (
                                <tr>
                                <td>No recipes</td>
                                </tr>
                            ) : (
                                rows.recipes.map((recipe, i) => (
                                <tr>
                                <td key={i}>
                                    {recipe.id}
                                </td>
                                <td key={i}>
                                    {recipe.title}
                                </td>
                                <td className="expand" key={i}>
                                    {recipe.description}
                                </td>
                                <td className="fit" key={i}>
                                    <span className="actions">
                                        <DropdownTableEdit buttonText="" content="" myRecipe={recipe}/>
                                        <DropdownDeleteRecipe buttonText="" content="" recipe={recipe}/>
                                    </span>
                                </td>
                            </tr>
                            )))}
                        </tbody>
                    </table>
                    
            </div>  
    )
}

export default Table;
