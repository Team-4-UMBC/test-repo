import "./DropdownContent.css";
import { useState } from "react";

/**
 * THIS COMPONENT HANDLES THE LOGIN INPUT
 * If you want to grab any individual inputs, I have it so that the entered username is stored in username, and the entered password is stored in password
 * PLEASE DO ANY FETCHES/POSTS/WHATEVER IN handleSubmit
 * The username and password are saved once you click the log in button
 */
const DropdownContent = ({children, open}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const account = { username, password };
        
        /**
         * This fetch needs to check if the username and password matches anything in our database, if it does NOT, then do not login.
         */

        /*fetch('PUT API HERE', {
            method: 'POST',
        })
        */
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
                        <input 
                            type="text"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                    </label>
                <br/>
                <button type="submit">Log In
                </button>
            </form>
        </div>
    );
}

export default DropdownContent;