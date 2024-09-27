import React from "react";
import { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

//local imports
import { opend_backend } from "../../../declarations/opend_backend/index.js";
import { idlFactory } from "../../../declarations/nft/nft.did.js";
import { idlFactory as token_idl_factory } from "../../../declarations/token_backend/token_backend.did.js";
import logo from "../assets/logo.png";
import Button from "./Button.jsx";
import PriceLabel from "./PriceLabel.jsx";



let currency_info;

async function get_currency(){ 
 let currency = await opend_backend.get_currency_info();
 currency_info = {
  name: currency.name,
  symbol: currency.symbol
 }
}

get_currency();

function Item(props) {
  console.log('%c*** Item ' + props.id + ' Called ***', 'background-color:palevioletred');


    const[item_name, set_item_name] = useState("");
    const[item_owner, set_item_owner] = useState("");
    const[item_asset, set_item_asset] = useState("");


    const [loader_hidden, set_loader_hidden] = useState(true);
    const [blur, set_blur] = useState();
    const [listed_item, set_listed_item] = useState("");
    const [shoud_display, set_should_display] = useState(true);

    const [price_input, set_price_input] = useState("");
    const [sell_price, set_sell_price] = useState("0 ");
    const [button, set_button] = useState("");

    const [loading, set_loading] = useState(true);

    console.log("price_input", price_input);

    // set up a agent to make http requests
    const local_host = "http://127.0.0.1:3000";
    const agent = new HttpAgent({host: local_host});
    let nft_actor;

    async function load_nft() {
      //*** agent.fetchRootKey IS ONLY FOR LOCAL DEVELOPMENT
      await agent.fetchRootKey();
      console.log('%cload_nft called ' + props.id , 'background-color:purple');
      
      nft_actor = await Actor.createActor(idlFactory,{
        canisterId: props.nft_id,
        agent
      });
      
      const get_name = await nft_actor.get_name();
      const get_owner = await nft_actor.get_owner();
      const get_asset = await nft_actor.get_asset(); 

      const img_content = new Uint8Array(get_asset);
      const img_url = URL.createObjectURL(
        new Blob([img_content.buffer],{type:"image/png"})
      );

   
      //doesn't work properly
      /*
      set_item_info({
        ...item_info,
        name:get_name,
        owner:get_owner.toLocaleString(),
        asset:img_url
      });
      */

      set_item_name(get_name);
      set_item_asset(img_url);
      const selling_price = Number(await opend_backend.get_listed_price(props.nft_id));
      set_sell_price(selling_price);
      
      if (props.role === "My NFTs"){
        set_item_owner("Owner: " + get_owner.toLocaleString());

        const nft_listed = await opend_backend.is_listed(props.nft_id);
        if (nft_listed){
          set_item_owner("Owner: OpenD");
          set_blur({filter: "blur(4px)"});
          set_listed_item("Listed");
        }else {
        set_button(<Button
          handle_click={handle_sell}
          text={"Sell"}
        />);
        };
      } else if (props.role === "Discover"){
        const original_owner = (await opend_backend.get_original_owner(props.nft_id)).toLocaleString();
        const current_user = props.user_id.toLocaleString();
        
        if (original_owner !== current_user){
        set_item_owner("Owner: " + original_owner)
        set_button(<Button
          handle_click={handle_buy}
          text={"Buy"}
        />);
        } else{
          set_item_owner("You're selling this NFT")
        }
      }
        set_loading(false);
        

        console.log('%cload_nft finished ' + props.id, 'background-color:purple');
   
    }

    // Buying NFTs
    async function handle_buy(){
      console.log('%cbuy was triggered', 'background-color:');
      set_loader_hidden(false);
      // Create token actor
      await agent.fetchRootKey();
        const token_actor = await Actor.createActor(token_idl_factory,{
          canisterId: Principal.fromText("ajuq4-ruaaa-aaaaa-qaaga-cai"),
          agent
        });
     
        const seller_id = await opend_backend.get_original_owner(props.nft_id);
        const item_price = await opend_backend.get_listed_price(props.nft_id);

        console.log("token_actor",token_actor)
        const result = await token_actor.transfer(seller_id, item_price);
        if(result === "Success"){
            const transfer_result = await opend_backend.complete_purchase(props.nft_id, seller_id, props.user_id)
          console.log('%cresult of purchase', 'background-color:black', transfer_result);
        }
       
        console.log('%cresult of sale: ', 'background-color:black', result);
        set_loader_hidden(true);
        set_should_display(false);
    }

    // VARIABLE TO TRACK PRICE OF NFTs
    let price;
    // Causing Sell inputs to appear
    async function handle_sell(){
      console.log('%chandle_sell called', 'background-color:darkslategrey');
 
      set_price_input(
        <input
          placeholder={"Price in " + currency_info.symbol}
          type="number"
          className="price-input"
          value={price}
          onChange={(e)=> price = e.target.value}
        />
        
      );
    

      set_button(<Button 
      handle_click={sell_item}
      text={"Confirm"}
      />);
      
      console.log('%chandle_sell finished', 'background-color:darkslategrey');
    }

    async function sell_item() {
      console.log('%csell_item called', 'background-color:teal');
      set_loader_hidden(false);
      set_blur({filter: "blur(4px)"});
      const listing_result = await opend_backend.list_item(props.nft_id, Number(price));

      console.log('%clisting_result: ', 'background-color:', listing_result);
      if (listing_result === "Success"){
        const opend_id = await opend_backend.get_opend_canister_id();
        const transfer_result = await nft_actor.transfer_ownership(opend_id);
        console.log('%ctransfer_result: ', 'background-color:', transfer_result);
      };
      
      set_loader_hidden(true);
      set_button();
      set_price_input();
      set_listed_item("Listed");
      set_item_owner("OpenD");

      //set_item_info({
      //  ...item_info,
      //  owner:"OpenD"
      //});

      console.log('%csell_item finished', 'background-color:teal');
    }


    useEffect( ()=> {
      console.log('%cuse effect on Item called', 'background-color:');
        load_nft();
      console.log('%cuse effect on Item finished', 'background-color:');
    }, []);

    console.log('%citem_owner', 'background-color:', item_owner);

if (loading !== true){
  return (
    <div style={{display: shoud_display ? "inline" : "none"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          style={blur}
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-asset disCardMedia-img"
          src={item_asset}
        />
        <div className="disCardContent-root">
          <PriceLabel
            sell_price = {sell_price} 
            currency_symbol={currency_info.symbol} 
          />
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {item_name}
            <span className="purple-text"> {listed_item}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            {item_owner}
          </p>
          {loader_hidden === true?
          <div>
            {price_input}
            {button}
           </div>   
              :
            <div className="lds-ellipsis" hidden={loader_hidden}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          }
          
        </div>
      </div>
    </div>
  );
};

}

export default Item;
