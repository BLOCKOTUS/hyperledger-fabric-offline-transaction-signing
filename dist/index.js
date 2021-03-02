"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendProposal = exports.calculateSignature = exports.hashProposal = exports.createUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fabricCommon = require("fabric-common");

var _jsrsasign = require("jsrsasign");

var _elliptic = _interopRequireDefault(require("elliptic"));

var createUser = function createUser(_ref) {
  var name = _ref.name,
      password = _ref.password,
      mspid = _ref.mspid,
      signedCertPEM = _ref.signedCertPEM,
      privateKeyPEM = _ref.privateKeyPEM;
  return _fabricCommon.User.createUser(name, password, mspid, signedCertPEM, privateKeyPEM);
};

exports.createUser = createUser;

var hashProposal = function hashProposal(proposalBytes) {
  var md = new _jsrsasign.KJUR.crypto.MessageDigest({
    alg: "sha256",
    prov: "sjcl"
  });
  md.updateString(proposalBytes);
  return md.digest();
};

exports.hashProposal = hashProposal;

var calculateSignature = function calculateSignature(_ref2) {
  var privateKeyPEM = _ref2.privateKeyPEM,
      proposalDigest = _ref2.proposalDigest;

  var key = _jsrsasign.KEYUTIL.getKey(privateKeyPEM); // convert the pem encoded key to hex encoded private key


  var EC = _elliptic["default"].ec;
  var ecdsa = new EC('p256');
  var signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
  var sig = ecdsa.sign(Buffer.from(proposalDigest, 'hex'), signKey);
  var signature = Buffer.from(sig.toDER());
  return signature;
};

exports.calculateSignature = calculateSignature;

var sendProposal = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref3) {
    var _ref3$client, client, user, privateKeyPEM, _ref3$channel, channel, chaincode, fcn, args, appClient, appChannel, idx, endorsement, build_options, proposalBytes, proposalDigest, signature;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref3$client = _ref3.client, client = _ref3$client === void 0 ? 'blockotus' : _ref3$client, user = _ref3.user, privateKeyPEM = _ref3.privateKeyPEM, _ref3$channel = _ref3.channel, channel = _ref3$channel === void 0 ? 'mychannel' : _ref3$channel, chaincode = _ref3.chaincode, fcn = _ref3.fcn, args = _ref3.args;
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
    return _ref4.apply(this, arguments);
  };
}();

exports.sendProposal = sendProposal;