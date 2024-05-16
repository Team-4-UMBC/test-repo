import "./DropdownTable.css";
import { useState } from "react";
import { TextInput } from 'react-native';

const DropdownTableContent = ({ children, open, recipe1}) => {
    const [recipe, setRecipe] = useState(recipe1);
    const [id, setId] = useState(recipe.id);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newInstructions, setNewInstructions] = useState('');
    const [newImage, setNewImage] = useState('');

    /**
     * Insert backend fetches here in handleSubmit probably, all info is passed through recipe
     * Maybe something that takes the new Inputs and simply replaces the info where the id is located?
     * Right now, none of the inputs are required.
     *
     */

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className={`dropdown-content
        ${open ? "content-open" : null}`}>
        {children}
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    placeholder= {recipe.title}
                    placeholderTextColor = {"grey"}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{width: "300px", height: "50px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}
                    multiline = {true}
                />
                <br/>
                <TextInput
                        type="text"
                        placeholder={recipe.Description}
                        placeholderTextColor = {"grey"}
                        value = {newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        style={{width: "300px", height: "50px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}  
                        multiline = {true} 
                    />
                    <br/>
                <TextInput
                        type="text"
                        placeholder={recipe.Instructions}
                        placeholderTextColor = {"grey"}
                        value = {newInstructions}
                        onChange={(e) => setNewInstructions(e.target.value)}
                        style={{width: "300px", height: "100px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}  
                        multiline = {true} 
                    />
                <div>
                        <h4>Insert New Image</h4>
                        <input 
                            type="file" 
                            className="imgInput"
                            value = {newImage} 
                            onChange={(e => setNewImage(e.target.value))} />
                        <img src={newImage} />
                    </div>
                    <button type="submit" className="myButton">Change Recipe</button>
            </form>

        </div>
    )
}

export default DropdownTableContent;