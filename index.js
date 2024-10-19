

var providerNEW;
var signerNEW;
var userAccountNEW;
var AAornot;
const MasterChainID = 64165; //250 is Fantom Mainnet, 64165

 const call_type = {
  CONNECT: 1,
  SEND_CONTRACT: 2,
  FULL_SCREEN: 3,
  NEW_ACCOUNT: 4,
  CONNECT_AA: 5,
  GET_BALANCE: 6,
  INSTALL_PROMPT: 7
};

const response_type = {
  ERROR   : 1,
  HASH    : 2,
  RECEIPT : 3,
  ACCOUNT_NUMBER: 4,
  READ_RESPONSE: 5,
  ROTATE: 6,
  UPDATE: 7,
  WALLET: 8,
  KEY: 9,
  RECOVERY: 10,
  BALANCE: 11,
  AA_CONNECTED: 12
};

var GLOBALWALLETADDRESS;


// document.getElementById('btn-connectwallet').addEventListener("click", function(event) {
//   ConnectWallet()
// }, {once: false});

// const web3 = new Web3(Web3.givenProvider) ;
// const from = await web3.eth.getAccounts();
/* ORIGINAL CONNECT WALLET WEB3*/ 
async function ConnectWallet(){
  

  if (window.ethereum == null) {

    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed so are
    // only have read-only access
    
    //provider = ethers.getDefaultProvider()
    //providerNEW = new ethers.JsonRpcProvider('https://rpcapi.sonic.fantom.network/');

  } else {

    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    providerNEW = new ethers.BrowserProvider(window.ethereum)
    
    const network = await providerNEW.getNetwork();
    var chainId = network.chainId;
    // Convert chainId to a number before comparison
    chainId = parseInt(chainId, 10);
    

    // Check if chain ID is not 250
    if (chainId !== MasterChainID) {
      switchToFantom();
      alert("Switch to Fantom Network before Connecting."); // Display alert pop-up
      return;
    }
    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signerNEW = await providerNEW.getSigner();
  } 

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    if (error.code === 4001) {
      window.location.href = 'ethereum:';
    } else {
      
    }
  }

  userAccountNEW = await signerNEW.getAddress();

  

  

  AAornot = false;
  GLOBALWALLETADDRESS = userAccountNEW;
  sendBalanceinfo();
  response(response_type.ACCOUNT_NUMBER, userAccountNEW);
  
}







//################################### AA ####################################
/**/


/**/
function CreateWeb2Wallet(){
  const wallet = ethers.Wallet.createRandom();
  AA_privateKey = wallet.privateKey;
  AA_recipient = wallet.address;
  
  
  
}


// Step 1: Define your RPC URL and Chain ID
const AA_rpcUrl = 'https://rpc.testnet.soniclabs.com';
const AA_chainId = 64165;

// Step 2: Define the provider with the custom RPC
const AA_provider = new ethers.JsonRpcProvider(AA_rpcUrl, {
  name: 'soniclabs-testnet',
  chainId: AA_chainId,
});

// Step 3: Create or restore a wallet
// If you want to create a new wallet, uncomment the following line
// const AA_wallet = ethers.Wallet.createRandom();

// If you want to use an existing wallet with a private key:
//const AA_privateKey = '0xbec809822ba49af479831ae939f98280b5e8fd5c0d737099d484b447c94f5055';
//const AA_recipient = '0x879CbB5C20506671F22D9085BC09b11b14E5Fa01'; // Replace with recipient address

//const AA_privateKey = '0x9bd104d9735138271e084ae34c596bd82ff40bc5ac637b998bb81efb0e79294d';
//const AA_recipient = '0xd1F555ba3b88A8eA0Cc0066119eFb47d98E32Ff7'; // Replace with recipient address

//MASTER CONTRACT --- use this and will create several new one to rotate
//**** store these faucet information in UNITY, pass it with key arg */


var AA_wallet;


async function getSBalance(walletAddress) {
  const balanceInWei = await AA_provider.getBalance(walletAddress);
  const balanceInEth = ethers.formatEther(balanceInWei);
  
  
  response(response_type.BALANCE, balanceInEth);
}

async function sendBalanceinfo() {
  try {
    // Check if GLOBALWALLETADDRESS is defined and not empty
    if (!GLOBALWALLETADDRESS) {
      
      return; // Exit the function if no wallet address is defined
    }

    // Fetch the balance and convert it to ETH
    const balanceInWei = await AA_provider.getBalance(GLOBALWALLETADDRESS);
    const balanceInEth = ethers.formatEther(balanceInWei);

    // Log and respond with the balance
    
    response(response_type.BALANCE, balanceInEth);
    
  } catch (error) {
    // Handle any errors
    console.error("Error fetching balance: ", error);
  }
}
// Run the function every 21 seconds (21000 ms)
setInterval(sendBalanceinfo, 21000);



//########THIS IS AA VERSION,  there is another web3 version of ConnectWallet
async function CreateAndConnectWeb2Wallet(fkey,pass){ 
  //After player decided to create an account/with guest login/google or apple/
  //if the logged in account has no WALLET then run this function!
  //create them a new web2 wallet (means wallet linked to web2)
  //this is connecting newly created wallet. BUT need to transfer gas to it.
  //So need to call a faucet function with faucet key.

  //Create a wallet for web3 account after they register web2
  const wallet = ethers.Wallet.createRandom();
  var AA_privateKey = wallet.privateKey;
  var AA_recipient = wallet.address;
  
  
  
  

  AA_wallet = new ethers.Wallet(AA_privateKey, AA_provider);
  
  //********UNITY have to provide they key but now i use preset one first**************************************************************
  //*******const faucet_wallet = new ethers.Wallet(fkey, AA_provider);*****************************************************************
  
  const faucet_master = new ethers.Wallet(fkey, AA_provider);
  
  const faucetContractAddress = '0xDCF9127a59169d889b1beC8e8148Dcc3DB66f994';
  const faucetABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "passcode",
          "type": "uint256"
        }
      ],
      "name": "distributeFaucet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  const faucetContract = new ethers.Contract(faucetContractAddress, faucetABI, faucet_master);


  try {
    // Call the distributeFaucet function
    const tx = await faucetContract.distributeFaucet(AA_recipient,pass);
    
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    
    
    
  } catch (error) {
      console.error('Error distributing faucet:', error.message);
  }

    
    const network = await AA_provider.getNetwork();
    
    var chainId = network.chainId;
    // Convert chainId to a number before comparison
    chainId = parseInt(chainId, 10);
    

    // Check if chain ID is not 250
    if (chainId !== MasterChainID) {
      switchToFantom();
      alert("Switch to Fantom Network before Connecting."); // Display alert pop-up
      return;
    }

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
   // signerNEW = await providerNEW.getSigner();
 

  

  

  AAornot = true;
  GLOBALWALLETADDRESS = AA_recipient;
  sendBalanceinfo();
  //response(response_type.ACCOUNT_NUMBER, AA_recipient);
  response(response_type.WALLET, AA_recipient);
  response(response_type.KEY, AA_privateKey);
  response(response_type.RECOVERY, wallet.mnemonic.phrase);
  AAornot = true;

}

async function ConnectAAWallet(aawalletaddress, aakey){ 
  //Assume old player logging in their web2 account
  //this is connecting created wallet from cloud. 
  //the arg should be the wallet.

  //Create a wallet for web3 account after they register web2
  var AA_privateKey = aakey;
  var AA_recipient = aawalletaddress;
  
  //
  //
  

  AA_wallet = new ethers.Wallet(AA_privateKey, AA_provider);
 
  
  const network = await AA_provider.getNetwork();
  
  var chainId = network.chainId;
  // Convert chainId to a number before comparison
  chainId = parseInt(chainId, 10);
  

  // Check if chain ID is not 250
  if (chainId !== MasterChainID) {
    switchToFantom();
    alert("Switch to Fantom Network before Connecting."); // Display alert pop-up
    return;
  }

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
   // signerNEW = await providerNEW.getSigner();
 

  

  

  AAornot = true;
  GLOBALWALLETADDRESS = AA_recipient;
  sendBalanceinfo();
  response(response_type.AA_CONNECTED, AA_recipient);
  AAornot = true;

}



//################################ AA END  #################################


var isfullscreen = false;
function EnterFullScreen(){
  if (isfullscreen){
    window.unityInstance.SetFullscreen(0);
    isfullscreen = false;
  } 
  else{
    window.unityInstance.SetFullscreen(1);
    isfullscreen = true;
    // Wait 100ms, then resize the canvas
    setTimeout(function() {
      resizeCanvasFS(130, 90);
    }, 100);
  }
}
function resizeCanvasFS(width, height) {
  var canvas = document.querySelector("#unity-canvas");
  if (canvas) {
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      // Center the canvas
      canvas.style.position = 'absolute';
      canvas.style.left = ((window.innerWidth - width) / 2) + 'px';
      canvas.style.top = ((window.innerHeight - height) / 2) + 'px';
  }
}

// ConnectWallet();

function JsCallFunction(type, arg_string){
  
  
  


  if(type == call_type.CONNECT){    
    ConnectWallet()  
    //CreateAndConnectWeb2Wallet();
  }  
  else if(type == call_type.FULL_SCREEN){    
    EnterFullScreen()  
  }
  else if (type == call_type.SEND_CONTRACT){
    arg_string = arg_string.toString()
    if (arg_string.startsWith("<sendContract>") && arg_string.endsWith("</sendContract>")){
      const removeSyntax = arg_string.substring("<sendContract>".length).slice(0,arg_string.length-("<sendContract>".length+"</sendContract>".length));
      const splited_text = removeSyntax.split("_%_");
      
      if (splited_text.length == 8){

          var bridge_id   = splited_text[0];
          var address     = splited_text[1];
          var method      = splited_text[2];
          var args        = splited_text[3];
          var price       = splited_text[4];
          var gasLimit    = splited_text[5];
          var gasPrice    = splited_text[6];
          var abi         = splited_text[7];



          sendContract(bridge_id, method, abi, address, args, price, gasLimit, gasPrice) 

      }
    }

  }
  else if (type == call_type.NEW_ACCOUNT){
    if (arg_string.startsWith("<sendContract>") && arg_string.endsWith("</sendContract>")){
      // create new account for AA
      const removeSyntax = arg_string.substring("<sendContract>".length).slice(0,arg_string.length-("<sendContract>".length+"</sendContract>".length));
      const splited_text = removeSyntax.split("_%_");
      
      if (splited_text.length == 2){

          var faucetkey   = splited_text[0];
          var pass     = splited_text[1];

          CreateAndConnectWeb2Wallet(faucetkey,pass);

      }

    }
  }
  else if (type == call_type.CONNECT_AA){
    if (arg_string.startsWith("<sendContract>") && arg_string.endsWith("</sendContract>")){
      const removeSyntax = arg_string.substring("<sendContract>".length).slice(0,arg_string.length-("<sendContract>".length+"</sendContract>".length));
      const splited_text = removeSyntax.split("_%_");
      
      if (splited_text.length == 2){

        var aawalletaddress   = splited_text[0];
        var aakey     = splited_text[1];

        ConnectAAWallet(aawalletaddress,aakey)
        //get addres and key from cloud to connect AA wallet

      }

    }
  }
  else if (type == call_type.GET_BALANCE){
    if (arg_string.startsWith("<sendContract>") && arg_string.endsWith("</sendContract>")){
      const walletaddress = arg_string.substring("<sendContract>".length).slice(0,arg_string.length-("<sendContract>".length+"</sendContract>".length));
      
      getSBalance(walletaddress);
      // get S balance to display

    }
  }
  else if (type == call_type.INSTALL_PROMPT){
    
      hideCanvasAndShowPrompt();
      //install prompt
  }


}
window.JsCallFunction = JsCallFunction;



async function JsGetFunction(type, arg_string){
  
  
  // 


  arg_string = arg_string.toString()
  if (arg_string.startsWith("<readContract>") && arg_string.endsWith("</readContract>")){
    const removeSyntax = arg_string.substring("<readContract>".length).slice(0,arg_string.length-("<readContract>".length+"</sendContract>".length));
    const splited_text = removeSyntax.split("_%_");
    
    if (splited_text.length == 5){

      var bridge_id   = splited_text[0];
      var address     = splited_text[1];
      var method      = splited_text[2];
      var args        = splited_text[3];
      var abi         = splited_text[4];

      
      
      
      
      // 



      var responseString = await readContract(bridge_id, method, abi, address, args, ) 

      
      

      response(response_type.READ_RESPONSE, bridge_id.toString() + "_%_" + JSON.stringify(responseString))

      return(JSON.stringify(responseString));
    }
  }


}
window.JsGetFunction = JsGetFunction;

//////////// WEB3 1.3.6 version of readcontract //////////////
/*
async function readContract(id, method, abi, contract, args) {
  
  // navigator.clipboard.writeText("<ContractRead>")
  return new Promise(async (resolve, reject) => {
    try {
      const from = (await web3.eth.getAccounts())[0];
      
      
      const result = await new web3.eth.Contract(JSON.parse(abi), contract).methods[method](...JSON.parse(args)).call();
      
      resolve(result); // Resolve the Promise with the result
    } catch (error) {
      console.error(error);
      reject(error); // Reject the Promise in case of an error
    }
  });
}
*/
//--------------------------------------------------------------- -READ- ---------------------------------------------
async function readContract(id, method, abi, contract, args) {
  // navigator.clipboard.writeText("<ContractRead>")
  return new Promise(async (resolve, reject) => {
    try {
      //const from = (await web3.eth.getAccounts())[0];
      
      
      
      const contracts = new ethers.Contract(contract, abi, providerNEW);
      const resulttemp = await contracts[method](...JSON.parse(args));
      //const result = resulttemp.map(value => value.toString());
      /*const result = {};
      for (const key in resulttemp) {
        result[key] = Array.from(resulttemp[key], val => val.toString());
      }*/

      //const result = JSON.stringify(resulttemp);
      //const result = await new web3.eth.Contract(JSON.parse(abi), contract).methods[method](...JSON.parse(args)).call();
      
      //const result = recursivelyConvertToString(resulttemp);
      //CHOOSE ONE to USE. the rest obsolate to reduce redundant.
      
      

      const unwraplog = unwrapProxy(resulttemp);
      

      
      const serializelog = convertBigIntsToStrings(unwraplog);
      
    
      
      
      //-------------------------
      resolve(serializelog); // Resolve the Promise with the result
    } catch (error) {
      console.error(error);
      reject(error); // Reject the Promise in case of an error
    }
  });
}
//---------------------------------- SEND --------------------------------------------------------------------------------
async function sendContract(id, method, abi, contract, args, value, gasLimit, gasPrice) { //conventional web3 wallet send
  //////////////// NO AA //////////////////////////////////////////////////////////////
  if (AAornot == false) {
    
    // Get network object
    providerNEW = new ethers.BrowserProvider(window.ethereum);
    const network = await providerNEW.getNetwork();
    var chainId = network.chainId;
    // Convert chainId to a number before comparison
    chainId = parseInt(chainId, 10);
    

    // Check if chain ID is not 250
    if (chainId !== MasterChainID) {
      switchToFantom();
      response(response_type.ERROR, method + "_%%_" + "wrong RPC, switch to Fantom Network and Retry.");
    } else {
      //const from = (await web3.eth.getAccounts())[0];
      const contracts = new ethers.Contract(contract, abi, providerNEW);
      const contractWithSigner = contracts.connect(signerNEW);
      
      var options = {};
      if (gasLimit != "") { options.gasLimit = gasLimit; }
      if (gasPrice != "") { options.gasPrice = gasPrice; }
      if (value    != "") { options.value    = value; }

      
      
      //
      
      
      
      
      
      
      
      
      
      try {
        
        
        const transaction = await contractWithSigner[method](...JSON.parse(args), options);
        
        const startTime = new Date();
        // Wait for the transaction to be mined and get receipt
        
        response(response_type.HASH, method);
        const receipt = await getTransactionReceiptWithRetry(transaction.hash, 120);
        
        const endTime2 = new Date();
        const timeTaken2 = endTime2 - startTime;
        
        //----------------------------------------
        
        const parsedLogs = [];
        for (const log of receipt.logs) {
          const parsedLog = contracts.interface.parseLog(log);
          
          if (parsedLog) {
            parsedLogs.push(parsedLog);
          } else {
            parsedLogs.push(log);
          }
        }
        
        // Now parsedLogs contains the parsed logs and raw logs if they didn't match the ABI
        

        const unwraplog = unwrapProxy(parsedLogs);
        

        
        const serializelog = convertBigIntsToStrings(unwraplog);
        

        const jsonlog = JSON.stringify(serializelog);
        
        response(response_type.RECEIPT, method + "_%%_" + JSON.stringify(serializelog));
        return receipt;
      } catch (error) {
        console.error('Error sending transaction:', error);
        response(response_type.ERROR, method + "_%%_" + error.message);
        //throw error; // rethrow the error to handle it at a higher level
      }
    }  
    sendBalanceinfo();
  } else { //////////////  AA is TRUE   ///////////////////////////////////////////////
    
    // Get network object
    providerNEW = AA_provider ;
    const network = await providerNEW.getNetwork();
    var chainId = network.chainId;
    // Convert chainId to a number before comparison
    chainId = parseInt(chainId, 10);
    

    // Check if chain ID is not 250
    if (chainId !== MasterChainID) {
      switchToFantom();
      response(response_type.ERROR, method + "_%%_" + "wrong RPC, switch to Fantom Network and Retry.");
    } else { 
      //const from = (await web3.eth.getAccounts())[0];
      const contracts = new ethers.Contract(contract, abi, providerNEW);
      const contractWithSigner = contracts.connect(AA_wallet);
      
      var options = {};
      if (gasLimit != "") { options.gasLimit = gasLimit; }
      if (gasPrice != "") { options.gasPrice = gasPrice; }
      if (value    != "") { options.value    = value; }

      
      
      //
      
      
      
      
      
      
      
      
      
      try {
        
        
        const transaction = await contractWithSigner[method](...JSON.parse(args), options);
        
        const startTime = new Date();
        // Wait for the transaction to be mined and get receipt
        
        response(response_type.HASH, method);
        const receipt = await getTransactionReceiptWithRetry(transaction.hash, 120);
        
        const endTime2 = new Date();
        const timeTaken2 = endTime2 - startTime;
        
        //----------------------------------------
        
        const parsedLogs = [];
        for (const log of receipt.logs) {
          const parsedLog = contracts.interface.parseLog(log);
          
          if (parsedLog) {
            parsedLogs.push(parsedLog);
          } else {
            parsedLogs.push(log);
          }
        }
        
        // Now parsedLogs contains the parsed logs and raw logs if they didn't match the ABI
        

        const unwraplog = unwrapProxy(parsedLogs);
        

        
        const serializelog = convertBigIntsToStrings(unwraplog);
        

        const jsonlog = JSON.stringify(serializelog);
        
        response(response_type.RECEIPT, method + "_%%_" + JSON.stringify(serializelog));
        return receipt;
      } catch (error) {
        console.error('Error sending transaction:', error);
        response(response_type.ERROR, method + "_%%_" + error.message);
        //throw error; // rethrow the error to handle it at a higher level
      }
      sendBalanceinfo();
    }  
  }
}
//############## AA SEND CONTRACT ###################
async function sendContractAA(id, method, abi, contract, args, value, gasLimit, gasPrice) { //for going with AA way, call this instead.
  
  // Get network object
  providerNEW = AA_provider ;
  const network = await providerNEW.getNetwork();
  var chainId = network.chainId;
  // Convert chainId to a number before comparison
  chainId = parseInt(chainId, 10);
  

  // Check if chain ID is not 250
  if (chainId !== MasterChainID) {
    switchToFantom();
    response(response_type.ERROR, method + "_%%_" + "wrong RPC, switch to Fantom Network and Retry.");
  } else { 
    //const from = (await web3.eth.getAccounts())[0];
    const contracts = new ethers.Contract(contract, abi, providerNEW);
    const contractWithSigner = contracts.connect(AA_wallet);
    
    var options = {};
    if (gasLimit != "") { options.gasLimit = gasLimit; }
    if (gasPrice != "") { options.gasPrice = gasPrice; }
    if (value    != "") { options.value    = value; }

    
    
    //
    
    
    
    
    
    
    
    
    
    try {
      
      
      const transaction = await contractWithSigner[method](...JSON.parse(args), options);
      
      const startTime = new Date();
      // Wait for the transaction to be mined and get receipt
      
      response(response_type.HASH, method);
      const receipt = await getTransactionReceiptWithRetry(transaction.hash, 120);
      
      const endTime2 = new Date();
      const timeTaken2 = endTime2 - startTime;
      
      //----------------------------------------
      
      const parsedLogs = [];
      for (const log of receipt.logs) {
        const parsedLog = contracts.interface.parseLog(log);
        
        if (parsedLog) {
          parsedLogs.push(parsedLog);
        } else {
          parsedLogs.push(log);
        }
      }
      
      // Now parsedLogs contains the parsed logs and raw logs if they didn't match the ABI
      

      const unwraplog = unwrapProxy(parsedLogs);
      

      
      const serializelog = convertBigIntsToStrings(unwraplog);
      

      const jsonlog = JSON.stringify(serializelog);
      
      response(response_type.RECEIPT, method + "_%%_" + JSON.stringify(serializelog));
      return receipt;
    } catch (error) {
      console.error('Error sending transaction:', error);
      response(response_type.ERROR, method + "_%%_" + error.message);
      //throw error; // rethrow the error to handle it at a higher level
    }
  }  
}
	  

//------------------------------------------------------Assisting Decoding function--------------------
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
////////////////////
async function getTransactionReceiptWithRetry(txHash, maxRetries) {
  let retries = 0;
  let txReceipt = null;
  await delay(800); // Wait for 0.5 seconds before retrying
  while (retries < maxRetries) {
    await delay(450); // Wait for 0.5 seconds before retrying
    txReceipt = await providerNEW.getTransactionReceipt(txHash);

    if (txReceipt) {
      
      return txReceipt;
    }

    retries++;
    
  }
  
  return null;
}
////////////////////
function unwrapProxy(proxy) {
  if (typeof proxy !== 'object' || proxy === null) {
    return proxy;
  }
  if (Array.isArray(proxy)) {
    return proxy.map(unwrapProxy);
  }
  // Check if the object being unwrapped is a private function
  if (proxy.stateMutability === 'private') {
    // Decode the private function's ABI and extract its arguments
    const args = abi.decode(proxy.signature, proxy.args);

    // Return the private function's arguments
    return args;
  }
  const result = {};
  for (let key in proxy) {
    result[key] = unwrapProxy(proxy[key]);
  }

  return result;
}
//////////////////
function convertBigIntsToStrings(obj) {
  if (typeof obj === 'bigint') {
      return obj.toString();
  } else if (Array.isArray(obj)) {
      return obj.map(item => convertBigIntsToStrings(item));
  } else if (typeof obj === 'object' && obj !== null) {
      const result = {};
      for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
              result[key] = convertBigIntsToStrings(obj[key]);
          }
      }
      return result;
  } else {
      return obj;
  }
}


//----------------------------------------------------------


async function response(respondType, message){

  var responseString = "<response>" + respondType + "_%_" + message + "</response>"

  window.unityInstance.SendMessage("JavascriptBridgeManager", "ResponseToUnity", responseString);

}



window.getAggressiveGasPrice = async function() {
  try {
    /*
    // Retrieve the current gas price
    const gasPrice = await web3.eth.getGasPrice();

    // Convert the gas price to BigInt
    const gasPriceBigInt = BigInt(gasPrice);

    // Adjust the gas price by multiplying with a factor (e.g., 2 for 100% increase)
    const aggressiveGasPrice = gasPriceBigInt * BigInt(15) / BigInt(10); // Multiplies by 1.5 as an example

    // Convert the gas price to Gwei or other units if desired
    const aggressiveGasPriceGwei = web3.utils.fromWei(aggressiveGasPrice.toString(), 'gwei');

    
    window.unityInstance.SendMessage("Web3Manager", "UpdateGasPrice", aggressiveGasPrice.toString());
    return aggressiveGasPrice.toString(); // Return the aggressive gas price
    */

    //const contract = new ethers.Contract(contractAddress, contractABI, providerNEW);
		//const contractWithSigner = contract.connect(signerNEW);
    //const startTime3 = new Date();
      //const gasEstimate = await contractWithSigner.BattlePet.estimateGas('0', '3');
      //
      // Get current gas price
      
      const feeData = await providerNEW.getFeeData();
      const bignumgas = feeData.gasPrice * BigInt(15) / BigInt(10);
      //const gasPrice = numbergas.toString();
      

      return bignumgas;

  } catch (error) {
    console.error('Error:', error);
    throw error; // Throw the error
  }
};




//const { ethers, providers } = require('ethers');
/*
const fantomChain = {
  chainId: "0x190",
  chainName: "Fantom Opera",
  rpcUrls: ["https://rpc.ankr.com/fantom/"],
  nativeCurrency: {
    symbol: "FTM",
    decimals: 18,
  },
  blockExplorerUrls: ["https://ftmscan.com/"],
};
*/
async function switchToFantom() {
  const hexValue = "0x" + MasterChainID.toString(16);
  try{
    await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: hexValue }],    // sonic testnet is 0xFAA5 mainnet 0xFA
    });
  }catch (error) {
    // Handle errors appropriately:
    if (error.code === 4902) { // Check for "User rejected the request" error code
      console.error("User rejected the network switch request.");
      // Optionally display a user-friendly message explaining the situation
    } else if (error.code === 4901) { // Check for "Chain not found" error code
      console.error("Fantom Chain not found in your wallet.");
      // Provide clear instructions on how to add the Fantom Chain (e.g., link to a guide)
    } else {
      console.error("Error switching to Fantom Chain:", error);
      // Optionally display a generic error message for other unexpected errors
    }
  }
 }

// Call the connectToFantom function to connect to the Fantom chain
//connectToFantom();


// Get a reference to the button element
const rotateButton = document.getElementById("unity-rotate-button");

// Add a click event listener to the button
rotateButton.addEventListener("click", function() {
  // Call the rotateCanvas function here
  rotateCanvas();
   // Optional for debugging
});

var isHorizontal = true;
function rotateCanvas() {
  
  isHorizontal = ! isHorizontal;
  
  var canvas = document.getElementById('unity-canvas');
  var temp = canvas.style.width;
  canvas.style.width = canvas.style.height;
  canvas.style.height = temp;
  
  response(response_type.ROTATE, isHorizontal);
}

//---------------Install Prompt -------------------------
/*window.addEventListener('load', () => {
  setTimeout(() => {
    
    hideCanvasAndShowPrompt(); // Call the function to show the install prompt
  }, 5000); // 5000 milliseconds = 5 seconds
});
*/


// Function to hide the canvas and show the modal with install prompt
function hideCanvasAndShowPrompt() {
  //const canvas = document.getElementById('yourCanvasId'); // Replace with your canvas ID
  canvas.style.display = 'block'; // Hide the canvas

  // Create a modal div
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.padding = '20px';
  modal.style.backgroundColor = '#fff';
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  modal.style.zIndex = '1000';

  // Create text message
  const message = document.createElement('p');
  message.innerText = 'Do you want to install the Fate Adventure WebAPP?';
  modal.appendChild(message);

  // Create Yes button
  const yesButton = document.createElement('button');
  yesButton.innerText = 'Yes';
  yesButton.onclick = () => {
      // Call the install prompt function here
      showInstallPrompt();
      document.body.removeChild(modal); // Remove the modal
  };
  modal.appendChild(yesButton);

  // Create No button
  const noButton = document.createElement('button');
  noButton.innerText = 'No';
  noButton.onclick = () => {
      document.body.removeChild(modal); // Remove the modal
      canvas.style.display = 'block';
  };
  modal.appendChild(noButton);

  // Append the modal to the body
  document.body.appendChild(modal);
}

