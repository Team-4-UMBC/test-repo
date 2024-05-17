import "./DropdownTable.css";
import { useState } from "react";
import { TextInput } from 'react-native';

const DropdownTableContent = ({ children, open, recipe1}) => {
    const [imageData, setImageData] = useState(null);
    const [oldImage_name, setOld] = useState(recipe1.image_name);
    const [image_name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [id, setID] = useState(recipe1.id);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newInstructions, setNewInstructions] = useState('');
    const [newIngredients, setNewIngredients] = useState('');

    /**
     * Insert backend fetches here in handleSubmit probably, all info is passed through recipe
     * Maybe something that takes the new Inputs and simply replaces the info where the id is located?
     * Right now, none of the inputs are required.
     *
     */
    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageData(e.target.files[0])
        setName(e.target.files[0].name);
    }

    const handleSubmit = (e) => {
        const recipe = { id, oldImage_name, newTitle, newIngredients, newDescription, newInstructions, image_name, imageData };
        e.preventDefault();
        const formData = new FormData();
        if(recipe.imageData) {
            formData.append('id', recipe.id);
            formData.append('image_name', recipe.image_name);
            formData.append('oldImage_name', recipe.oldImage_name);
            formData.append('imageData', recipe.imageData, recipe.image_name);
        }

        if(recipe.id && (recipe.newTitle || recipe.newIngredients || recipe.newDescription || recipe.newInstructions || (recipe.image_name && recipe.oldImage_name))) {
            fetch('http://localhost:5000/edit_recipe', {
                method: 'POST',
                mode: 'cors',
                headers: {
                Accept: 'application/json',
                'Content-Type': "application/json"
                },
                body: JSON.stringify(recipe),
            })
            .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    alert("Recipe change successful")
                }
                else {
                    alert("Recipe change failed")
                }
            })
        }

        if(recipe.imageData) {
            fetch('http://localhost:5000/edit_image', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    alert("Image change successful")
                }
                else {
                    alert("Image change failed")
                }
            })
        }
    }

    return (
        <div className={`dropdown-content1
        ${open ? "content-open" : null}`}>
        {children}
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    placeholder= {recipe1.title}
                    placeholderTextColor = {"grey"}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{width: "300px", height: "50px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}
                    multiline = {true}
                />
                <br/>
                <TextInput
                        type="text"
                        placeholder={recipe1.description}
                        placeholderTextColor = {"grey"}
                        value = {newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        style={{width: "300px", height: "50px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}  
                        multiline = {true} 
                    />
                    <br/>
                <TextInput
                        type="text"
                        placeholder={recipe1.ingredients}
                        placeholderTextColor = {"grey"}
                        value = {newIngredients}
                        onChange={(e) => setNewIngredients(e.target.value)}
                        style={{width: "300px", height: "100px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}  
                        multiline = {true} 
                />
                <TextInput
                        type="text"
                        placeholder={recipe1.instructions}
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
                        onChange={handleChange} />
                </div>
                <button type="submit" className="myButton">Change Recipe</button>
            </form>

        </div>
    )
}

export default DropdownTableContent;