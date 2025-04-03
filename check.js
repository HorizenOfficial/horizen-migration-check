import JSONbig from "json-bigint";
import fs from "fs";
import Web3 from "web3";
const jsonBig = JSONbig({ storeAsString: true });

const ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "_cumulativeHash",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

var web3;

export default async function doCheck() {
    console.log("Horizen migration check script");
    console.log("Using the following parameters:");
    console.log("ZEND_DUMP: " +process.env.ZEND_DUMP);
    console.log("EON_DUMP: " +process.env.EON_DUMP);
    console.log("NETWORK: " +process.env.NETWORK);   
    console.log("ZEND_VAULT_CONTRACT: " +process.env.ZEND_VAULT_CONTRACT);  
    console.log("EON_VAULT_CONTRACT: " +process.env.EON_VAULT_CONTRACT);   
    console.log("\n"); 
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.NETWORK));

    console.log("Checking EON balances");
    var jsonFile = fs.readFileSync(process.env.EON_DUMP).toString('utf-8');
    var jsonData = jsonBig.parse(jsonFile);
    var tuples = Object.entries(jsonData).map(([key, value]) => [key, value.toString()]);  
    tuples.sort((a, b) => a[0].localeCompare(b[0]));
    var hash = calculateHash(tuples, true);
    console.log("Hash computed locally:", hash);

    var vaultEONContract = new web3.eth.Contract(ABI, process.env.EON_VAULT_CONTRACT);
    var cumulativeHash = await vaultEONContract.methods._cumulativeHash().call();
    console.log('Hash from contract:', cumulativeHash);
    if(cumulativeHash != hash){
      console.error("[ERROR] EON balances not confrming with hash published by: "+process.env.EON_VAULT_CONTRACT);
      return false;
    }else{
      console.log("\u2705 EON balances verified correctly");
    }

    console.log("Checking ZEND balances");
    jsonFile = fs.readFileSync(process.env.ZEND_DUMP).toString('utf-8');
    jsonData = jsonBig.parse(jsonFile);
    var tuples = Object.entries(jsonData).map(([key, value]) => [key, value.toString()]);  
    tuples.sort((a, b) => a[0].localeCompare(b[0]));
    var hash = calculateHash(tuples, false);
    console.log("Hash computed locally:", hash);

    var vaultEONContract = new web3.eth.Contract(ABI, process.env.ZEND_VAULT_CONTRACT);
    var cumulativeHash = await vaultEONContract.methods._cumulativeHash().call();
    console.log('Hash from contract:', cumulativeHash);
    if(cumulativeHash != hash){
      console.error("[ERROR] ZEND balances not conforming with hash published by: "+process.env.ZEND_VAULT_CONTRACT);
      return false;
    }else{
      console.log("\u2705 ZEND balances verified correctly");
    }
    console.log("\u2705 All balances are correct!");

    return true;
}

function calculateHash(tuples, isEON){
  var dumpRecursiveHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
  for (const [key, value] of tuples) {
    const encoded = web3.eth.abi.encodeParameters(['bytes32', isEON ? 'address' : 'bytes20', 'uint256'],[dumpRecursiveHash, key, value])
    dumpRecursiveHash = web3.utils.sha3(encoded, {encoding: 'hex'});
  }
  return dumpRecursiveHash;    
}



