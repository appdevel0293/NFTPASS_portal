import {update} from "firebase/database";
import Web3 from 'web3';
import ABI from "./abicontract.json";


var clientAccount = null;
const quicknodeRPCConfig = {
    chainId: '0x13881',
    chainName: 'Polygon',
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    nativeCurrency: {symbol: 'MATIC', decimals: 18},
    rpcUrls: ['https://red-multi-valley.matic-testnet.discover.quiknode.pro/61b21728fa928158390362bfe247eab7ee8c68e7/'],
  };
var phantomProviderEVM = null;
var globalContractnNFT = null;

const CONTRACT_ADDRESS = '0x707560dC874F9B0331Dc4A72d150D93298bB4Cac';

export async function verifyTicket(databaseRef, setStep){
    const isPhantomInstalled = window?.phantom?.ethereum?.isPhantom;

    if(!isPhantomInstalled){
        update(databaseRef, { action: "no phantom" });
        setStep("Please connect from phantom App");
        return;

    }

    const provider = window.phantom?.ethereum;

    if(!provider){
        update(databaseRef, { action: "no ethereum" });
        setStep("Please configure required Blockchain");
        return;

    }

    provider.request({method: 'eth_requestAcconts'}).then( (accounts) =>{
    clientAccount = accounts[0];

    update(databaseRef, { action: "connected", account: clientAccount });
    setStep("Wallet connected, verifying ticket");

    provider.request({
        method: 'wallet_switchEthereumChain',
        params: {quicknodeRPCConfig}
    }).then(()=>{

        phantomProviderEVM = provider;
        verification(clientAccount, databaseRef, setStep);




    });

        }
    );

}

async function verification(clientAccount, databaseRef, setStep) {
    
    await getWalletNFT(clientAccount).then(id => {
        if(id!=0){
            update(databaseRef, { action: "possess" });
            setStep("Ticket found, verifying validity");
            const isV = isVerified(id);

            if(!isV){
                update(databaseRef, { action: "granted" });
                setStep("Ticket is valid, Welcome to the QuickNode Party!");

            }
            else {
                update(databaseRef, { action: "already_used" });
                setStep("Ticket has already been used");

            }


        }
        else{
            update(databaseRef, { action: "denied" });
            setStep("No matching tickets found on this wallet");

        }
    });

}

async function getWalletNFT(clientAccount){
    
    let contractNFT = await getInstanceContract(); 
    return contractNFT.methods.getIdOwnedbyAccount(0, clientAccount).then((d) => {
        return d;
    });
}

async function getInstanceContract(){
    if(!globalContractnNFT){
    let web3 = new Web3(phantomProviderEvm);
    const contract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    globalContractnNFT = contract;
    return contract;
    }
    else {
        return globalContractnNFT;
    }
 

}

async function isVerified(id){
    let contractNFT = await getInstanceContract();
    return contractNFT.methods.getVerified(0,id).call().then((result) => {
        return result;
    });
}