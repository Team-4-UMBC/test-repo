import "./DropdownContent.css";
import { useState } from "react";
import {TextInput} from 'react-native';

/**
 * THIS COMPONENT HANDLES THE CREATE ACCOUNT INPUT
 * If you want to grab any individual inputs, I have it so that the entered username is stored in username, and the entered password is stored in password
 * PLEASE DO ANY FETCHES/POSTS/WHATEVER IN handleSubmit
 * The username and password are saved once you click the log in button
 */
const DropdownCreateContent = ({children, open}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const account = { username, password, email };
        
        /**
         * This fetch needs to check if a username is already in the database, if it is, DO NOT let them create the account, otherwise just add it to the database.
         */
        if(account.username.length <= 20 && account.username.length > 0 && account.email.length <= 30 && account.email.length > 0 && account.password.length <= 100 && account.password.length > 0 && account.email.includes("@") && account.email.includes(".")) {
            fetch('http://localhost:5000/create_user', {
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
                    alert("Account created")
                }
                else {
                    alert("Account not created")
                }
            })
        }
        else {
            alert("Invalid input")
        }
    }
    return (
        //This div collects the inputs.
        <div className={`dropdown-content 
            ${open ? "content-open" : null}`}>
            {children} 
            <form onSubmit={handleSubmit}>
                <label className="input-content"> Username: 
                         <input 
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                    </label>
                <label className="input-content">
                    Password: 
                        <TextInput 
                            type="text"
                            style={{borderColor: 'gray', borderWidth: 1}}
                            secureTextEntry={true}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                    </label>
                <label className="input-content">
                    Email:
                        <input 
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                    </label>
                <br/>
                <button type="submit">Create Account
                </button>
            </form>
        </div>
    );
}

export default DropdownCreateContent;