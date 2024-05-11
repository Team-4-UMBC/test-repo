import "./upload.css"
import React, {useState, useRef} from 'react'

const Upload = () => {

    //Goes into database
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [file, setFile] = useState();
    
    //Does not go into database


    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const post = { title, ingredients, description, instructions, file };
        
        /**
         * Same as before, title, ingredients, and instructions are REQUIRED, description and file are OPTIONAL
         * If successful, it should probably give a confirmation or sum
         */
        
        //Resets after submit.
        e.target.reset();
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
                        onChange={(e) => setTitle(e.target.value)}    
                    />
                    <h3>Description</h3>
                    <div className="editorContainer">
                        <textarea className = "editor" name="editor" placeholder="Enter a description here" onChange={(e) => setDescription(e.target.description)}/>
                    </div>
                    <h3>Ingredients</h3>
                    <div className="smolContainer">
                        <textarea className = "editor" name="editor" placeholder="Enter Ingredients here" onChange={(e) => setIngredients(e.target.ingredients) } required/>
                    </div>
                    <h3>Instructions</h3>
                    <div className="notSmolContainer">
                        <textarea className = "editor" name="editor" placeholder="Enter Recipe Instructions here" onChange={(e) => setIngredients(e.target.ingredients) } required/>
                    </div>
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

    /*
    return(
        <section className="upload-post">
            <div className="container">
                <h2>Upload A Recipe</h2>
                <p className="form_error-message">
                    This is an error message
                </p>
                <form className="form create-post_form">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
                    autoFocus />
                    <input type="file" onChange={e => setImage(e.target.files[0])} accept="png, jpg, jpeg"></input>
                    <button type="submit" className="btn-submit">Upload Recipe</button>
                </form>
            </div>
        </section>
    )
    */
    
}


export default Upload