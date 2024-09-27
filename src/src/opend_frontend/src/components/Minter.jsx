import React from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";


//local imports
import {opend_backend} from "../../../declarations/opend_backend"
import Item from "./Item";

function Minter() {
  console.log('%c*** Minter Called ***', 'background-color:palevioletred');

  // be sure to check the documentation when using "useForm"
  const {register, handleSubmit} = useForm();
  const [nft_principal, set_nft_principal] = useState("");
  const [loader_hidden, set_loader_hidden] = useState(true)

  async function onSubmit(data){
    set_loader_hidden(false);
    const name = data.name;
    const image = data.image[0];
    const image_byte_data = [
      ...new Uint8Array(
          await image.arrayBuffer()
      )
    ];

    const new_NFD_id = await opend_backend.mint(image_byte_data, name);
    set_nft_principal(new_NFD_id);

    console.log("the name: ", name);
    console.log("the image: ", image.name);
    console.log("new NFT ID: ", new_NFD_id.toLocaleString());
    set_loader_hidden(true);
  }

  if (nft_principal == ""){

    return (
      <div className="minter-container">
        
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form className="makeStyles-form-109" noValidate="" autoComplete="off">
          <div className="upload-container">
            <input
            //must use a spread operator to update/contain all the information
            {...register("image",{required:true})}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
              {...register("name", {required:true})}
                placeholder="e.g. CryptoDunks"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
           
           {loader_hidden === true?
            <span 
              className="form-Chip-label"
              onClick={handleSubmit(onSubmit)}  
            >Mint NFT
            </span>
              :
            <div className="lds-ellipsis" hidden={loader_hidden}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          }
          </div>
        </form>
      </div>
    );
  } else {
    return(
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item nft_id={nft_principal}/>
        </div>
      </div>
    );
  };

};

export default Minter;
