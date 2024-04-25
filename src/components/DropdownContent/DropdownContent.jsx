import "./DropdownContent.css";

const DropdownContent = ({children, open}) => {
    return (
        

        <div className={`dropdown-content 
            ${open ? "content-open" : null}`}>
            {children} 
            <label className="input-content">
                Username: <input name="username" />
            </label>
            <label className="input-content">
                Password: <input name="password" />
            </label>
        </div>
    );
}

export default DropdownContent;