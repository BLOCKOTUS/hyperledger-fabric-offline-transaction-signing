"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendProposal = void 0;

var _jsrsasign = require("jsrsasign");

var _elliptic = require("elliptic");

var calculateSignature = function calculateSignature(_ref) {
  var privateKeyPEM = _ref.privateKeyPEM,
      proposalDigest = _ref.proposalDigest;

  var key = _jsrsasign.KEYUTIL.getKey(privateKeyPEM);

  var ecdsa = new _elliptic.ec('p256');
  var signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
  var sig = ecdsa.sign(Buffer.from(proposalDigest, 'hex'), signKey);
  var halfOrderSig = preventMalleability(sig, ecdsa);
  var signature = Buffer.from(halfOrderSig.toDER());
  return signature;
};

var preventMalleability = function preventMalleability(sig, ecdsa) {
  var halfOrder = ecdsa.n.shrn(1);

  if (sig.s.cmp(halfOrder) === 1) {
    var bigNum = ecdsa.n;
    sig.s = bigNum.sub(sig.s);
  }

  return sig;
};

var sendProposal = function sendProposal(_ref2) {
  var client = _ref2.client,
      user = _ref2.user,
      privateKeyPEM = _ref2.privateKeyPEM,
      channel = _ref2.channel,
      chaincode = _ref2.chaincode,
      fcn = _ref2.fcn,
      args = _ref2.args;
  // create an identity context
  var idx = client.newIdentityContext(user); // build the proposal

  var endorsement = channel.newEndorsement(chaincode);
  var build_options = {
    fcn: fcn,
    args: args,
    chaincodeId: chaincode,
    channelId: channel.name
  };
  var proposalBytes = endorsement.build(idx, build_options);
  console.log({
    proposalBytes: proposalBytes.toString()
  }); // hash the proposal

  var proposalDigest = user.getCryptoSuite().hash(proposalBytes.toString(), null);
  console.log({
    proposalDigest: proposalDigest
  }); // calculate the signature

  var signature = calculateSignature({
    privateKeyPEM: privateKeyPEM,
    proposalDigest: proposalDigest
  });
  console.log({
    signature: signature.toString()
  }); // sign the proposal endorsment

  endorsement.sign(signature); // send the proposal

  return endorsement.send({
    targets: channel.getEndorsers()
  });
};

exports.sendProposal = sendProposal;