import React from "react";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownEditAcct from "../DropdownContent/DropdownEditAcct";
import "./Dropdown.css";
import { useState } from "react";

const DropdownEdit = ({buttonText, content, click, open, username, email}) => {

    return (
        <div className="dropdown">
            <DropdownButton toggle={click} open={open}>
                {buttonText}            
            </DropdownButton>
            <DropdownEditAcct open={open} username1={username} email1={email}>
                {content}
            </DropdownEditAcct>
        </div>
        
    );
};

export default DropdownEdit;