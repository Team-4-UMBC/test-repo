import React from "react";

import "../Edit/recipelist.css";
import DropdownDeleteUser from "../../components/Dropdown/DropdownDeleteUser";

export const AdminTable = ({ rows }) => {
    return(
        <div className="start">         
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof rows.users == 'undefined') ? (
                                <tr>
                                <td>No users</td>
                                </tr>
                            ) : (
                                rows.users.map((user, i) => (
                                <tr>
                                <td key={i}>
                                    {user.username}
                                </td>
                                <td className="expand" key={i}>
                                    {user.email}
                                </td>
                                <td className="fit">
                                    <span className="actions">
                                        <DropdownDeleteUser buttonText="" content="" user={user}/>
                                    </span>
                                </td>
                            </tr>
                            )))} 
                        </tbody>
                    </table>
                    
            </div>  
    )
}