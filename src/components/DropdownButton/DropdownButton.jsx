import "./DropdownButton.css";
import "./arrow-down-sign-to-navigate.png";

const DropdownButton = ({children, open, toggle}) => {
    
        return (
            <div onClick={toggle} className={`dropdown-btn ${open ? "button-open" : null}`}> 
                {children} 
                    <span>
                        <img src={require("./arrow-down-sign-to-navigate.png") } style={{width:"12", height:"12"}}></img>
                    </span>
            </div>
        );
};

export default DropdownButton;