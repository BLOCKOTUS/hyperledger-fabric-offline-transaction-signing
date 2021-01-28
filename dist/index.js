"use strict";

require("core-js/modules/es.function.name.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSignedProposal = exports.createUser = void 0;

var _fabricCommon = require("fabric-common");

var createUser = function createUser(_ref) {
  var name = _ref.name,
      password = _ref.password,
      mspid = _ref.mspid,
      signedCertPem = _ref.signedCertPem,
      privateKeyPEM = _ref.privateKeyPEM;
  return _fabricCommon.User.createUser(name, password, mspid, signedCertPem, privateKeyPEM);
};

exports.createUser = createUser;

var generateSignedProposal = function generateSignedProposal(_ref2) {
  var client = _ref2.client,
      user = _ref2.user,
      channel = _ref2.channel,
      chaincode = _ref2.chaincode,
      fcn = _ref2.fcn,
      args = _ref2.args;
  var appClient = typeof client === 'string' ? new _fabricCommon.Client(client) : client;
  var appChannel = typeof channel === 'string' ? new _fabricCommon.Channel(channel, appClient) : channel;
  var idx = appClient.newIdentityContext(user);
  var endorsement = appChannel.newEndorsement(chaincode);
  var build_options = {
    fcn: fcn,
    args: args
  };
  var proposalBytes = endorsement.build(idx, build_options);
  return proposalBytes;
};

exports.generateSignedProposal = generateSignedProposal;