import React from "react";

function Button(props){
    console.log('%c*** Button Called ***', 'background-color:palevioletred');


    return(
        <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
              onClick={props.handle_click}
              className="form-Chip-label"
            >
             {props.text}
            </span>
        </div>

    )
}

export default Button