import React from "react";
import {BrowserRouter, Link, Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";

//local imports
import logo from "../assets/logo.png";
import homeImage from "../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
//import CURRENT_USER_ID from "../index.jsx";
import { opend_backend } from "../../../declarations/opend_backend";

function Header() {
  console.log('%c*** Header Called ***', 'background-color:palevioletred');

  const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");

  const [user_owned_gallery, set_owned_gallery] = useState([]);
  const [listing_gallery, set_listing_gallery]= useState([])

  

  async function get_user_NFTs(user){
    console.log('%cget_user_NFTs called', 'background-color:blue');
    const user_id = user !== '' && undefined ? user :CURRENT_USER_ID;
    const listed_NFTs = await opend_backend.get_listed_NFTs(); 
    const user_NFT_ids = await opend_backend.get_owned_NFTs(user_id);
    set_listing_gallery(<Gallery 
      title="Discover"
      ids={listed_NFTs}
      user_id={user_id}
    />);
    console.log("user_id, ", user_id);
    set_owned_gallery(
      <Gallery 
        title="My NFTs"
        ids={user_NFT_ids}
        user_id={user_id}
      />
    );
    console.log('%cget_user_NFTs finished', 'background-color:blue');
  }

  useEffect(()=>{
    console.log("use effect on header called");
    get_user_NFTs();
  }, []);

  return (
    <BrowserRouter>
    <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <h5 className="Typography-root header-logo-text"><Link to="/">OpenD</Link></h5>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
      
            <button 
              className="ButtonBase-root Button-root Button-text header-navButtons-3"
            >
              <Link reloadDocument to="/discover">Discover</Link>
            </button>
            <button 
              className="ButtonBase-root Button-root Button-text header-navButtons-3"
            >
              <Link to="/minter">Minter</Link>
            </button>
            <button 
              className="ButtonBase-root Button-root Button-text header-navButtons-3"
            >
              <Link reloadDocument to="/collection">My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <img 
              className="bottom-space" 
              src={homeImage} 
            />
          }  
        />
        <Route 
          path="/discover"
          element={listing_gallery}
        />
        <Route 
          path="/minter"
          Component={Minter}
        />
        
        <Route
          path="/collection"
          element={user_owned_gallery}
          />
      </Routes>

    </BrowserRouter>
  );
  
}

export default Header;
