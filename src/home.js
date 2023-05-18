import './home.css';
import QRCode from "react-qr-code";
import {db} from "./firebase";
import {set, ref, onValue,update} from "firebase/database";
import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


function Home(){

const href = window.location.href;
const address = `https://phantom.app/ul/browse/${href}verify`;

const name = href.replaceAll('/','').replaceAll('.','');
const databaseRef = ref(db,`/${name}` );
const Navigate = useNavigate();

let data;

useEffect(()=>{

    const listener = onValue(databaseRef, (snapshot) => {
        data = snapshot.val();
        if (data === null){
            createCollection();
        }
        else if(data.action === "scanned") {
            console.log("Action is set to Scanned");
            Navigate("/access");
        }

    });

    return () => {
        listener();
    }

    
},[]);

const createCollection = () => {

   

    const account = "0x";
    const access = false;
    const action = "init";


    set(databaseRef, {
        account,
        access,
        action,
    })
}




return(
    <div className='container'>
        <img src = "party.png" alt = "Image" className='image'/>
        <hi className="header">
            Scan Using your Phantom
        </hi>
        <div className='qrcode-container'>
            <QRCode
            size={256}
            style={{width:"100%"}}
            value={address}
            viewBox={'0 0 256 256'}/>
        </div>
    </div>
);


}

export default Home;