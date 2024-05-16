import React from "react";

import "./recipelist.css";
import DropdownTableEdit from "../../components/Dropdown/DropdownTableEdit";

export const Table = ({ rows, deleteRow, editRow }) => {
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
                                    ID= {recipe.id}
                                </td>
                                <td>
                                    Title= {recipe.title}
                                </td>
                                <td className="expand">
                                    Description= {recipe.Description}
                                </td>
                                <td className="fit">
                                    <span className="actions">
                                        <DropdownTableEdit buttonText="" content="" myRecipe={recipe}/>
                                        <img className="delete-btn" src={require("./svgviewer-png-output(1).png") } style={{width:"24", height:"24"}}></img>
                                    </span>
                                </td>
                            </tr>
                            ))} 
                        </tbody>
                    </table>
                    
            </div>  
    )
}