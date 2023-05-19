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
        console.log("inside is phaton instaled")
        update(databaseRef, { action: "no phantom" });
        setStep("Please connect from phantom App");
        return;

    }

    const provider = window.phantom?.ethereum;

    if(!provider){
        console.log("inside isnot provider")

        update(databaseRef, { action: "no ethereum" });
        setStep("Please configure required Blockchain");
        return;

    }

    provider.request({method: 'eth_requestAccounts'}).then( (accounts) =>{
    clientAccount = accounts[0];
    console.log("inside request eth accounts")
    console.log(clientAccount);

    update(databaseRef, { action: "connected", account: clientAccount });
    setStep("Wallet connected, verifying ticket");

    provider.request({
        method: 'wallet_switchEthereumChain',
        params: [quicknodeRPCConfig]
    }).then(()=>{

        console.log("inside rwhitch ethereum chain")


        phantomProviderEVM = provider;
        verification(clientAccount, databaseRef, setStep);




    }).catch((error) => {
        console.error(error);
      });

        }
    ).catch((error) => {
        console.error(error);
      });

}

async function verification(clientAccount, databaseRef, setStep) {
    try {
        const id = await getWalletNFT(clientAccount);

        if (id != 0) {
            update(databaseRef, { action: "possess" });
            setStep("Ticket found, verifying validity");
            const isV = await isVerified(id);
            console.log("isVerified has a value of " + isV);

            if (!isV) {
                update(databaseRef, { action: "granted" });
                setStep("Ticket is valid, Welcome to the QuickNode Party!");
            } else {
                update(databaseRef, { action: "already_used" });
                setStep("Ticket has already been used");
            }
        } else {
            update(databaseRef, { action: "denied" });
            setStep("No matching tickets found on this wallet");
        }
    } catch (error) {
        console.error(error);
    }
}

async function getWalletNFT(clientAccount){
    console.log("get wallet nft")
    
    let contractNFT = await getInstanceContract(); 
    return contractNFT.methods.getIdOwnedbyAccount(0, clientAccount).call().then((d) => {
        console.log("se consiguio la id de "  +d)
        return d;

    });
}

async function getInstanceContract(){
    console.log("inside get instance contract")
    if(!globalContractnNFT){
    let web3 = new Web3(phantomProviderEVM);
    const contract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    globalContractnNFT = contract;
    return contract;
    }
    else {
        return globalContractnNFT;
    }
 

}

async function isVerified(id) {
    console.log("inside isVerified");

    let contractNFT = await getInstanceContract();
    try {
        const result = await contractNFT.methods.getVerified(0, id).call();
        return result;
    } catch (error) {
        console.error(error);
    }
}