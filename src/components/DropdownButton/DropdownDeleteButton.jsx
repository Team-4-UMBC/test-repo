import "./DropdownEditButton.css";

const DropdownDeleteButton = ({children, open, toggle}) => {
    return <div onClick={toggle} className={`edit-btn ${open ? "button-open" : null}`}> 
        {children} 
        <span>
            <img src={require("../../pages/Edit/svgviewer-png-output(1).png") } style={{width:"24", height:"24"}}></img>
        </span>
    </div>;
};

export default DropdownDeleteButton;