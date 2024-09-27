import React from "react";
import {useState, useEffect} from "react";

import Item from "./Item";

function Gallery(props) {
  console.log('%c*** Gallery Called ***', 'background-color:palevioletred');

  const [items, set_items] = useState();

  console.log("items: ", items);

  async function fetch_NFTs(){
    console.log("%cfetch_NFTs called", "background-color:green");
    console.log("gallery prop.user_id, ", props.user_id);
    const ids = await props.ids;
    if (ids && ids.length > 0){
        let items_temp = await ids.map( (nft_id_temp, index) => (
          <Item
            role = {props.title} 
            nft_id= {nft_id_temp} 
            key={nft_id_temp.toLocaleString()} 
            id={index}
            user_id={props.user_id}
          />
        ))
        console.log('%cfetch_NFTs finished succesfully', 'background-color:green');

        set_items(items_temp);
      
    }else {
    console.log('%cfetch_NFTs finished failure', 'background-color:green');
    };
    
  }

 useEffect(()=>{
    console.log("use effect on gallery called");
    fetch_NFTs();
  },[])

console.log('%cReturn for Gallery', 'background-color:red');
  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
           {items}    
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Gallery;
