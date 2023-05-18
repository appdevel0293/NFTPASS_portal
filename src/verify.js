
import { useEffect, useState } from "react";
import {db} from "./firebase";
import {set, ref, get, update} from "firebase/database";


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


    });




    return(
        <div>

        </div>
    );
}

export default Verify;