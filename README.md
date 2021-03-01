# WIP - do not use yet

<a href="https://twitter.com/BLOCKOTUS">
    <img
         src="https://img.shields.io/twitter/follow/BLOCKOTUS?style=for-the-badge&logo=twitter"
     />
</a>
<a href="https://github.com/danielfebrero">
    <img
         src="https://img.shields.io/github/followers/danielfebrero?label=danielfebrero&style=for-the-badge&logo=github"
     />
</a>
<a href="https://github.com/BLOCKOTUS/admins">
    <img
         src="https://img.shields.io/github/stars/BLOCKOTUS/hyperledger-fabric-offline-transaction-signing?logo=github&style=for-the-badge"
     />
</a>
<a href="https://github.com/BLOCKOTUS/admins">
    <img
         src="https://img.shields.io/github/license/BLOCKOTUS/hyperledger-fabric-offline-transaction-signing?style=for-the-badge"
     />
</a>

<br />

# || BLOCKOTUS || Offline Transaction Signing
## for Hyperledger Fabric

<br />
<br />
<br />

<p align="center">
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
  <img 
      style="margin-right: 50px" 
      height="60px" 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/240px-JavaScript-logo.png" 
  />
</a>
<a href="https://www.hyperledger.org/use/fabric">
  <img 
      style="margin-right: 0px" 
      height="60px" 
      src="https://www.hyperledger.org/wp-content/uploads/2018/03/Hyperledger_Fabric_Logo_Color-1-300x84.png" 
  />
</a>
</p>
<br />
<br />
<br />

## Abstract

> In most use cases an application will persist the user's credentials including the private key and sign transactions for the user. However some business scenarios may require higher level of privacy. What if the user wants to keep their private key secret and does not trust another system or backend server to securely store it and use it?

> The fabric-common package comes with the ability to sign a transaction outside of the application. The application may choose to include the signature when calling the send method of the service instead of the identity context that would be used to create the signature. **[1]**

## Documentation

```javascript
import { createUser, sendProposal } from 'hyperledger-fabric-offline-transaction-signing';

const user = createUser({
  name, 
  password,
  mspid,
  signedCertPem,
  privateKeyPEM,
});

const proposalResponse = await sendProposal({
  client = 'blockotus',
  user,
  privateKeyPEM,
  channel = 'mychannel',
  chaincode,
  fcn,
  args,
});
```

This repository is part of the [BLOCKOTUS Organism](https://github.com/BLOCKOTUS/organism).

[BLOCKOTUS Architecture](https://github.com/BLOCKOTUS/organism/blob/master/docs/architecture.md)

## _Tool compatible with || BLOCKOTUS || Organism_

Build complete decentralized applications with __Blockotus Open and Decentralized Standard__ and __Hyperledger Fabric__. 

The kit includes a Frontend (Svelte / React), a Backend (Nodejs / Express), a Network and Chaincode Contracts (Hyperledger Fabric) as specified by Blockotus Open and Decentralized Standard.

[BLOCKOTUS Organism](https://github.com/BLOCKOTUS/organism).

<br />
<br />
<br />

<a href="https://github.com/hyperledger/fabric-sdk-node/tree/master/fabric-network">
  <img src="https://img.shields.io/badge/fabric--network-%402.3.0-green?style=for-the-badge" />
</a>

<br />
<br />

## References

 **[1]** <https://hyperledger.github.io/fabric-sdk-node/release-2.2/tutorial-sign-transaction-offline.html>