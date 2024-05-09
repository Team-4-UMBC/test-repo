import {useLocation} from 'react-router-dom';

export const Search = () => {

    const search_state = useLocation();
    console.log(search_state)
    return(
        <div>
        {(typeof search_state.state.recipes == 'undefined') ? (
        <p>Loading...</p>
        ) : (
            search_state.state.recipes.map((recipe, i) => (
            <div>
            <div class="margin">
            </div>
            <div className="ROTD">
                <h2 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,textDecoration:"underline"}}>{recipe.title}</h2>

    
                <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:10,marginTop:45}}>Ingredients</h3>
                <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:20}}>
                <li>{recipe.ingredients}</li>
                </ul>
    
                <h3 style = {{width:"30vw", height: "169px",display:"inline-block",position:"absolute",marginTop:-3,marginLeft:"20vw",marginTop:45}}>Instructions</h3>
                <ul style={{ width: "200px", height: "90px", overflow: "hidden", position:"absolute", display:"inline-block",marginTop:75,marginLeft:"20vw"}}>
                <li>{recipe.instructions}</li>
                </ul>
            </div>
            </div>
        )))}
        </div>
    );
}

export default Search;