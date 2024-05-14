import { TextInput } from "react-native-web";
import "./upload.css"
import React, {useState, useRef} from 'react'

const Upload = () => {

    //Goes into database
    const [user, setUser] = useState('')
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [file, setFile] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [image_name, setName] = useState('');
    
    //Does not go into database


    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageData(e.target.files[0])
        setName(e.target.files[0].name);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const post = { user, title, ingredients, description, instructions, image_name };
        const formData = new FormData();
        formData.append('image_name', image_name);
        formData.append('imageData', imageData, image_name);
        /**
         * Same as before, title, ingredients, and instructions are REQUIRED, description and file are OPTIONAL
         * If successful, it should probably give a confirmation or sum
         */
        
        //Resets after submit.
        if(post.user && post.title && post.ingredients && post.instructions) {
            fetch('http://localhost:5000/upload_recipe', {
                method: 'POST',
                mode: 'cors',
                headers: {
                Accept: 'application/json',
                'Content-Type': "application/json"
                },
                body: JSON.stringify(post),
            })
            .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    alert("Recipe upload successful")
                }
                else {
                    alert("Recipe upload failed. Make sure all necessary fields are filled.")
                }
            })
        }
        else {
            alert("Recipe upload failed. Make sure all necessary fields are filled.")
        }

        if(formData.imageData) {
            fetch('http://localhost:5000/upload_image', {
                method: 'POST',
                body: formData,
                })
                .then(response => response.json())
                .then(data1 => {
                    if (data1.status === 1){
                        alert("Image upload successful")
                    }
                    else {
                        alert("Image upload failed")
                    }
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="add">
                <div className="content">
                    <h2>Create Post</h2>
                    <input 
                        type="text"
                        placeholder="Title"
                        required
                        value = {title}
                        onChange={(e) => setTitle(e.target.value)}    
                    />
                    <input 
                        type="text"
                        placeholder="Username"
                        required
                        value = {user}
                        onChange={(e) => setUser(e.target.value)}    
                    />
                    <TextInput
                        type="text"
                        placeholder="Description"
                        placeholderTextColor = {"grey"}
                        required
                        value = {description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{width: "900px", height: "200px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}  
                        multiline = {true} 
                    />
                    <TextInput 
                        type="text"
                        placeholder="Ingredients"
                        placeholderTextColor = {"grey"}
                        required
                        value = {ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        style={{width: "900px", height: "200px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}   
                        multiline = {true}     
                    />
                    <TextInput 
                        type="text"
                        placeholder="Instructions"
                        placeholderTextColor = {"grey"}
                        required
                        value = {instructions}
                        onChange={(e) => setInstructions(e.target.value)}  
                        style={{width: "900px", height: "200px", borderColor: 'lightgray', borderWidth: 1, padding: '10px', fontSize: '15px'}}  
                        multiline = {true}   
                    />

                    
                    <div>
                        <h2>Add Image:</h2>
                        <input type="file" className="imgInput" onChange={handleChange} />
                        <img src={file} />
                    </div>
                    <button type="submit" className="myButton">Post Recipe</button>
                </div>
            </div>
        </form>
    );
    
}


export default Upload