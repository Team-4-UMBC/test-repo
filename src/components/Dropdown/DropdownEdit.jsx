import React from "react";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownEditAcct from "../DropdownContent/DropdownEditAcct";
import "./Dropdown.css";
import { useState } from "react";

const DropdownEdit = ({buttonText, content}) => {

    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const toggleDropdown = () => {
        setOpen((open) => !open);
        return fetch("http://localhost:5000/display_user", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                    }
            }).then((res) => 
            res.json().then((data) => {
                setUsername(data.username);
                setEmail(data.email);
            })
        );
    };

    return (
        <div className="dropdown">
            <DropdownButton toggle={toggleDropdown} open={open}>
                {buttonText}            
            </DropdownButton>
            <DropdownEditAcct open={open} username1={username} email1={email}>
                {content}
            </DropdownEditAcct>
        </div>
        
    );
};

export default DropdownEdit;