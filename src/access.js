import { useEffect, useState } from "react";
import {db} from "./firebase";
import {ref, update, onValue} from "firebase/database";
import './access.css';
import { RiLoader4Line } from 'react-icons/ri';
import LoadingBar from 'react-top-loading-bar';
import {useNavigate } from 'react-router-dom';





function Access(){

    const href = window.location.href;
    const index = href.lastIndexOf('/access');
    const nameTemp = href.slice(0, index);
    const name = nameTemp.replaceAll('/','').replaceAll('.','');
    const [action, setAction] = useState('scanned')
    const [wallet, setWallet] = useState('undefined')
    const [loadingProgress, setLoadingProgress] = useState(0);
    const Navigate = useNavigate();


    const databaseRef = ref(db, `/${name}`);
  
    let data;

    useEffect(() =>{
        const listener = onValue(databaseRef, (snapshot) => {
            console.log("we are doing something")
            data = snapshot.val();
            wait(data.action);
            setWallet(data.account);
            if ( action === "no phantom" ||
                action === "no ethereum" ||
                action === "granted" ||
                action === "already_used" ||
                action === "denied" ||
                action === "granted"   ||
                action === "init"       
            ) {
                timer();
            }
        });
        return () => {
            listener();
        }
    });

    async function wait(action){
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAction(action);
       
    }

    function timer() {

        const timer = setInterval(() => {
            setLoadingProgress((prevProgress) => prevProgress + 10);

        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            update(databaseRef,{action: "init"});
            Navigate('/');
     
        }, 5000); 

    }



    if (action === "scanned") {
        return(
            
            <div className="scanned">
                <RiLoader4Line className="spinner-icon" />

                <h1>Checking Attendee</h1>
            </div>
        )
    
    }

    else  if (action === "no phantom") {
        return(
            <div className="alert">
             <LoadingBar progress={loadingProgress} height={8} color="#65A84A" />
 

                <h1>Please access from a Phantom Wallet</h1>
            </div>
        )
    
    }

    else  if (action === "no ethereum") {
        return(
            <div className="alert">
             <LoadingBar progress={loadingProgress} height={8} color="#65A84A"/>
 

                <h1>Wallet is not set up for the required Network</h1>
            </div>
        )
    
    }

    else  if (action === "connected") {
    
        return(
            <div className="scanned">
                 <RiLoader4Line className="spinner-icon" />
                <h1>Checking NFT ticket for wallet</h1>
                <p>{wallet}</p>
            </div>
        )
    
    }

    else  if (action === "havenft") {
        return(
            <div className="scanned">
             <RiLoader4Line className="spinner-icon" />
                <h1>Ticket found, verifying validity</h1>
            </div>
        )
    
    }

    else  if (action === "granted") {
        return(
            <div className="access-granted">
             <LoadingBar progress={loadingProgress} height={8} color="#f11946" />
 
                <h1>Welcome to the QuickNode Party!</h1>
            </div>
        )
    
    }
    else  if (action === "already_used") {
        return(
            <div className="alert">
             <LoadingBar progress={loadingProgress} height={8} color="#65A84A"/>
 
                <h1>Ticket is already in use</h1>
            </div>
        )
    
    }

    else  if (action === "denied") {
        return(
            <div className="alert">
             <LoadingBar progress={loadingProgress} height={8} color="#65A84A" />
 
                <h1>Couln't find a valid ticket in your wallet</h1>
            </div>
        )
    
    }
    else   {
        return(
            <div>
             <LoadingBar progress={loadingProgress} height={8} color="#65A84A"/>
 
                <h1>Redirecting</h1>
            </div>
        )
    
    }
   
}

export default Access;