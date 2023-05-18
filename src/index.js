import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home";
import Access from "./access";
import Verify from "./verify";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route index element = {<Home/>} />
                    <Route path="access" element = {<Access/>} />
                    <Route path = "verify" element = {<Verify />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />
 
);


