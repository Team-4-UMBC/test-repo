import "./upload.css"

export default function Upload(){
    return(
        <div className="upload">
            <form className="uploadForm">
                <div className="uploadFormGroup">
                    <input type="file" id="fileInput" />
                    <input type="text" placeholder="Title"/>

                </div>
            </form>
        </div>
    )
}