import {db} from "./firebase";
import React, { useEffect, useState} from 'react';
import { ref, update} from "firebase/database";
import {verifyTicket} from './blockchain'






function Verify(){

  const href = window.location.href;
  const index = href.lastIndexOf('/verify');
  const nameTemp = href.slice(0, index);
  const name = nameTemp.replaceAll('/','').replaceAll('.','');

  const databaseRef = ref(db, `/${name}`);
  const [step, setStep] = useState('');



  useEffect(()=>{

    update(databaseRef, {action: "scanned"});
    setStep("Connecting");

    verifyTicket(databaseRef, setStep);

  }, []);
  


  return (
    <div>
      <header>
        <p>{step}</p>
      </header>
    </div>
  );

}

export default Verify;
