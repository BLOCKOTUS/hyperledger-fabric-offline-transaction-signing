"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendProposal = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
  var halfOrder = ecdsa.halfOrder;

  if (!halfOrder) {
    throw new Error('Can not find the half order needed to calculate "s" value for immalleable signatures. Unsupported curve name: ' + curveParams.name);
  }

  if (sig.s.cmp(halfOrder) === 1) {
    var bigNum = ecdsa.order;
    sig.s = bigNum.sub(sig.s);
  }

  return sig;
};

var sendProposal = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref2) {
    var _ref2$client, client, user, privateKeyPEM, _ref2$channel, channel, chaincode, fcn, args, appClient, appChannel, idx, endorsement, build_options, proposalBytes, proposalDigest, signature;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2$client = _ref2.client, client = _ref2$client === void 0 ? 'blockotus' : _ref2$client, user = _ref2.user, privateKeyPEM = _ref2.privateKeyPEM, _ref2$channel = _ref2.channel, channel = _ref2$channel === void 0 ? 'mychannel' : _ref2$channel, chaincode = _ref2.chaincode, fcn = _ref2.fcn, args = _ref2.args;
            // retrieve Client and Channel
            appClient = typeof client === 'string' ? new _fabricCommon.Client(client) : client;
            appChannel = typeof channel === 'string' ? new _fabricCommon.Channel(channel, appClient) : channel; // create an identity context

            idx = appClient.newIdentityContext(user); // build the proposal

            endorsement = appChannel.newEndorsement(chaincode);
            build_options = {
              fcn: fcn,
              args: args
            };
            proposalBytes = endorsement.build(idx, build_options); // hash the proposal

            proposalDigest = hashProposal(proposalBytes); // calculate the signature

            signature = calculateSignature({
              privateKeyPEM: privateKeyPEM,
              proposalDigest: proposalDigest
            }); // sign the proposal endorsment

            endorsement.sign(signature); // send the proposal

            _context.next = 12;
            return endorsement.send({
              targets: appChannel.getEndorsers()
            });

          case 12:
            return _context.abrupt("return", _context.sent);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendProposal(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.sendProposal = sendProposal;