
import React, { useEffect, useState} from 'react';
import {db} from "./firebase";
import {set, ref, get, update} from "firebase/database";
import {verifyTicket} from './blockchain'


function Verify(){

    const href = window.location.href;
    const index = href.lastIndexOf('/verify');
    const nameTemp = href.slice(0, index);
    const name = nameTemp.replaceAll('/','').replaceAll('.','');
    console.log(name);
    const databaseRef = ref(db, `/${name}`);
    const [step, setStep] = useState('');

    

    useEffect(()=>{

        update(databaseRef, {action: "scanned"});
        setStep("Connecting");

        verifyTicket(databaseRef, setStep);





    });




    return(
        <div>
          <header >
        <p>
          {step}
        </p>
      
      </header>

        </div>
    );
}

export default Verify;