import React from "react";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownCreateContent from "../DropdownContent/DropdownCreateContent";
import "./Dropdown.css";
import { useState } from "react";

const DropdownCreate = ({buttonText, content}) => {

    const [open, setOpen] = useState(false);
    const [visibility, setVisibility] = useState({login: false});

    const toggleDropdown = async () => {
        setOpen((open) => !open);
        return fetch('http://localhost:5000/status', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then((res) => 
            res.json().then((data) => {
                setVisibility({login: data.login});
            })
        );
    };

    return (
        <div className="dropdown">
            <DropdownButton toggle={toggleDropdown} open={open} show={!visibility}>
                {buttonText}            
            </DropdownButton>
            <DropdownCreateContent open={open}>
                {content}
            </DropdownCreateContent>
        </div>
        
    );
};

export default DropdownCreate;