import "./DropdownEditButton.css";

const DropdownEditButton = ({children, open, toggle}) => {
    return <div onClick={toggle} className={`edit-btn ${open ? "button-open" : null}`}> 
        {children} 
        <span>
            <img src={require("../../pages/Edit/pencil-50-256.png") } style={{width:"24", height:"24"}}></img>
        </span>
    </div>;
};

export default DropdownEditButton;