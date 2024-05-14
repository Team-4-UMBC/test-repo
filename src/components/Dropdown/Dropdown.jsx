import React from "react";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownContent from "../DropdownContent/DropdownContent";
import "./Dropdown.css";

const Dropdown = ({buttonText, content, click, open}) => {

    return (
        <div className="dropdown">
            <DropdownButton toggle={click} open={open}>
                {buttonText}            
            </DropdownButton>
            <DropdownContent open={open}>
                {content}
            </DropdownContent>
        </div>
        
    );
};

export default Dropdown;