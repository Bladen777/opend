import React from "react";
import {createRoot} from "react-dom/client"
import App from "./components/App";
import { Principal } from "@dfinity/principal";


//Having this here and exporting causes the entire file to be loaded on import which causes the canisters to be reloaded which is undesired.
//Therefore this has been moved to Header.JSX where is was being imported from.  

//const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
//export default CURRENT_USER_ID;

console.log('%c*** Index Started ***', 'background-color:palevioletred');

const root = createRoot(document.getElementById("root"));

const init = async () => {
  root.render(<App />);
};

init();



