"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendProposal = void 0;

var _fabricCommon = require("fabric-common");

var _jsrsasign = require("jsrsasign");

var _elliptic = _interopRequireDefault(require("elliptic"));

var hashProposal = function hashProposal(proposalBytes) {
  var md = new _jsrsasign.KJUR.crypto.MessageDigest({
    alg: "sha256",
    prov: "sjcl"
  });
  md.updateString(proposalBytes);
  return md.digest();
};

var calculateSignature = function calculateSignature(_ref) {
  var privateKeyPEM = _ref.privateKeyPEM,
      proposalDigest = _ref.proposalDigest;

  var key = _jsrsasign.KEYUTIL.getKey(privateKeyPEM);

  var ec = _elliptic["default"].ec;
  var ecdsa = new ec('p256');
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
  // retrieve Client and Channel
  var appClient = typeof client === 'string' ? new _fabricCommon.Client(client) : client;
  var appChannel = typeof channel === 'string' ? new _fabricCommon.Channel(channel, appClient) : channel; // create an identity context

  var idx = appClient.newIdentityContext(user); // build the proposal

  var endorsement = appChannel.newEndorsement(chaincode);
  var build_options = {
    fcn: fcn,
    args: args
  };
  var proposalBytes = endorsement.build(idx, build_options); // hash the proposal

  var proposalDigest = hashProposal(proposalBytes); // calculate the signature

  var signature = calculateSignature({
    privateKeyPEM: privateKeyPEM,
    proposalDigest: proposalDigest
  }); // sign the proposal endorsment

  endorsement.sign(signature); // send the proposal

  return endorsement.send({
    targets: appChannel.getEndorsers()
  });
};

exports.sendProposal = sendProposal;