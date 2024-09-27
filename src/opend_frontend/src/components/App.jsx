
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  console.log('%c*** App Called ***', 'background-color:palevioletred');

  return (
    <div className="App">
      <Header/>
      <Footer/>
    </div>
  );
}

export default App;
