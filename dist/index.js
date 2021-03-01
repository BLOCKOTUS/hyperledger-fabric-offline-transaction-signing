"use strict";

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendProposal = exports.calculateSignature = exports.hashProposal = exports.createUser = void 0;

require("regenerator-runtime/runtime.js");

var _fabricCommon = require("fabric-common");

var _jsrsasign = require("jsrsasign");

var _elliptic = require("elliptic");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createUser = function createUser(_ref) {
  var name = _ref.name,
      password = _ref.password,
      mspid = _ref.mspid,
      signedCertPem = _ref.signedCertPem,
      privateKeyPEM = _ref.privateKeyPEM;
  return _fabricCommon.User.createUser(name, password, mspid, signedCertPem, privateKeyPEM);
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

  var _KEYUTIL$getKey = _jsrsasign.KEYUTIL.getKey(privateKeyPEM),
      prvKeyHex = _KEYUTIL$getKey.prvKeyHex; // convert the pem encoded key to hex encoded private key


  var ecdsaCurve = _elliptic.curves['p256'];
  var ecdsa = new _elliptic.ec(ecdsaCurve);
  var signKey = ecdsa.keyFromPrivate(prvKeyHex, 'hex');
  var sig = ecdsa.sign(Buffer.from(proposalDigest, 'hex'), signKey);
  var signature = Buffer.from(sig.toDER());
  return signature;
};

exports.calculateSignature = calculateSignature;

var sendProposal = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
    var _ref3$client, client, user, privateKeyPEM, _ref3$channel, channel, chaincode, fcn, args, appClient, appChannel, idx, endorsement, build_options, proposalBytes, proposalDigest, signature;

    return regeneratorRuntime.wrap(function _callee$(_context) {
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
            return endorsement.send();

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