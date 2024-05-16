import React from "react";

import "../Edit/recipelist.css";
import DropdownDeleteUser from "../../components/Dropdown/DropdownDeleteUser";

export const AdminTable = ({ rows }) => {
    return(
        <div className="start">         
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(user => (
                                <tr>
                                <td>
                                    {user.id}
                                </td>
                                <td>
                                    {user.username}
                                </td>
                                <td className="expand">
                                    {user.email}
                                </td>
                                <td className="fit">
                                    <span className="actions">
                                        <DropdownDeleteUser buttonText="" content="" user={user}/>
                                    </span>
                                </td>
                            </tr>
                            ))} 
                        </tbody>
                    </table>
                    
            </div>  
    )
}