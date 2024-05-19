import "./DropdownContent.css";
import { useState } from "react";
import {TextInput} from 'react-native';

/**
 * THIS COMPONENT HANDLES THE LOGIN INPUT
 * If you want to grab any individual inputs, I have it so that the entered username is stored in username, and the entered password is stored in password
 * PLEASE DO ANY FETCHES/POSTS/WHATEVER IN handleSubmit
 * The username and password are saved once you click the log in button
 */
const DropdownEditAcct = ({children, open, username1, email1}) => {
    const [username, setUsername] = useState(username1);
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [email, setEmail] = useState(email1);
    const [acct, setAcct] = useState({status: 1});
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const account = { username, password, email, newUsername, newPassword, newEmail };
        
        /**
         * This fetch needs to check if the username and password matches anything in our database, if it does NOT, then do not login.
         */

        if(account.newUsername && account.newUsername.length <= 20 && account.newUsername !== account.username) {
            fetch('http://localhost:5000/edit_username', {
                method: 'POST',
                mode: 'cors',
                headers: {
                Accept: 'application/json',
                'Content-Type': "application/json"
                },
                body: JSON.stringify(account),
            })
            .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    setUsername(account.newUsername)
                    alert("Username change successful")
                }
                else {
                    alert("Username change failed")
                }
            })
        }
        else if (account.newUsername && account.newUsername.length > 20) {
            alert("Invalid input")
        }

        if(account.newEmail && account.newEmail.length <= 30 && account.newEmail.includes("@") && account.newEmail.includes(".") && account.newEmail !== account.email) {
            fetch('http://localhost:5000/edit_email', {
                method: 'POST',
                mode: 'cors',
                headers: {
                Accept: 'application/json',
                'Content-Type': "application/json"
                },
                body: JSON.stringify(account),
            })
            .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    setEmail(account.newEmail)
                    alert("Email change successful")
                }
                else {
                    alert("Email change failed")
                }
            })
        }
        else if(account.newEmail && (account.newEmail.length > 30 || !account.newEmail.includes("@") || !account.newEmail.includes("."))) {
            alert("Invalid input")
        }

        if(account.newPassword && account.newPassword.length <= 100 && account.newPassword !== account.password) {
            fetch('http://localhost:5000/edit_password', {
                method: 'POST',
                mode: 'cors',
                headers: {
                Accept: 'application/json',
                'Content-Type': "application/json"
                },
                body: JSON.stringify(account),
            })
            .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    setPassword(account.newPassword)
                    alert("Password change successful")
                }
                else {
                    alert("Password change failed")
                }
            })
        }
        else if(account.newPassword && account.newPassword.length > 100) {
            alert("Invalid input")
        }
    }


    const handleSubmit2 = (e) => {
        const account = { username }
        e.preventDefault();
        if(acct.status === 1) {
            alert("Are you sure you want to delete your account?\nClick the button again to confirm")
            setAcct({status: 2})
        }
        else if(acct.status === 2) {

            fetch('http://localhost:5000/delete_user', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': "application/json"
                    },
                    body: JSON.stringify(account),
                })
                .then(response => response.json())
                .then(data1 => {
                    if (data1.status === 1){
                        setAcct({status: 0})
                        alert("Successfully deleted account. Please close the dropdown.")
                    }
                    else {
                        alert("Failed to delete account")
                    }
            })
            setAcct({status: 1})
    
        }
    }
    
    return (       

        //This div collects the inputs.
        <div className={`dropdown-content 
            ${open ? "content-open" : null}`} style={{height:"50vh"}}>
            {children} 
            <h3 style={{textDecoration:"underline solid #fdb515 2px",textDecorationColor:"#fdb515"}}>Account Details</h3>
            <p>Username: {username1}</p>
            <p>Email: {email1}</p>
            <hr style={{width:"80%"}}></hr>
            <h3 style={{textDecoration:"underline solid #fdb515 2px",textDecorationColor:"#fdb515"}}>Edit Account Details</h3>
            <form onSubmit={handleSubmit}>
                <label className="input-content">
                <div style={{fontSize:14,fontWeight: "bold", textDecoration:"underline solid #fdb515 2px",textDecorationColor:"#fdb515"}}>New Username</div> 
                        <TextInput 
                            type="text"
                            style={{borderColor: 'gray', borderWidth: 1,display:"block",maxWidth:"100%",minWidth:"100%"}}
                            required
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            />
                </label>
                <label className="input-content">
                <div style={{fontSize:14,fontWeight: "bold", textDecoration:"underline solid #fdb515 2px",textDecorationColor:"#fdb515"}}>New Password</div> 
                        <TextInput 
                            type="text"
                            style={{borderColor: 'gray', borderWidth: 1,display:"block",maxWidth:"100%",minWidth:"100%"}}
                            secureTextEntry={true}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            />
                    </label>
                    <label className="input-content">
                    <div style={{fontSize:14,fontWeight: "bold", textDecoration:"underline solid #fdb515 2px",textDecorationColor:"#fdb515"}}>New Email</div>
                        <TextInput 
                            type="text"
                            style={{borderColor: 'gray', borderWidth: 1,display:"block",maxWidth:"100%",minWidth:"100%"}}
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            />
                    </label>
                <br/>
                <button class="submitButton" onClick={handleSubmit}>Edit account
                </button>
            </form>
            <button class="submitButton" onClick={handleSubmit2}>Delete account
            </button>
        </div>
    );

}

export default DropdownEditAcct;