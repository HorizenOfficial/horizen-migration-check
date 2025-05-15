## Horizen migration check script

Command line script to verify correctness of Horizen migration data.


### Prerequisites:

- Execute a full dump of ZEND and EON and produce the final json artifacts following [these instructions](https://horizen-2-docs.horizen.io/migration/dump-execution)
- RPC connection to a BASE node, and addresses of the official EON and ZEND Vault contracts
- NodeJS environment locally installed

### Instructions:

- Download this project and install the dependencies with:

   ```
   npm install
    ```

- Rename .env.template file into .env and complete the nested properties.


- Execute with:

   ```
   node index.js
    ```

- The script will calculate locally a cumulative hash from the dumps, and compare it to the one stored onchain in the vault smart contracts.<br>
If everything goes well, you will obtain a log like this in the console:

   ```
   Checking EON balances
   Hash computed locally: 0xbae9810c922613c3eb3364fe76bd19736472a3afb490e2772adfc25605479981
   Hash from contract: 0xbae9810c922613c3eb3364fe76bd19736472a3afb490e2772adfc25605479981
   ✅ EON balances verified correctly
   Checking ZEND balances
   Hash computed locally: 0x24afbbf6c451bc5e719e198d45cb97e084d6fddf0a3f1d203badda5a1635ea13
   Hash from contract: 0x24afbbf6c451bc5e719e198d45cb97e084d6fddf0a3f1d203badda5a1635ea13
   ✅ ZEND balances verified correctly
   ✅ All balances are correct!
    ```

