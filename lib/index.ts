import { Client, User, Channel, ProposalResponse } from 'fabric-common';
import { KJUR } from 'jsrsasign';
import { KEYUTIL, ec, curves } from 'elliptic'; 

import type { User as UserType } from 'fabric-common';
import type { 
    SendProposalArgs,
    CreateUserArgs,
 } from '../types';

export const createUser = ({
    name, 
    password,
    mspid,
    signedCertPem,
    privateKeyPEM,
}: CreateUserArgs): UserType => User.createUser(name, password, mspid, signedCertPem, privateKeyPEM);

export const hashProposal = (proposalBytes: Buffer): string => {
    let md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "sjcl"});
    md.updateString(proposalBytes);
    return md.digest();
};

export const calculateSignature = ({
    privateKeyPEM,
    proposalDigest,
}: {
    privateKeyPEM: string,
    proposalDigest: string,
}): Buffer => {
    const { prvKeyHex } = KEYUTIL.getKey(privateKeyPEM); // convert the pem encoded key to hex encoded private key
    const ecdsaCurve = curves['p256'];
    const ecdsa = new ec(ecdsaCurve);
    const signKey = ecdsa.keyFromPrivate(prvKeyHex, 'hex');
    const sig = ecdsa.sign(Buffer.from(proposalDigest, 'hex'), signKey);
    const signature = Buffer.from(sig.toDER());

    return signature;
}

export const sendProposal = async ({
    client = 'blockotus',
    user,
    privateKeyPEM,
    channel = 'mychannel',
    chaincode,
    fcn,
    args,
}: SendProposalArgs): Promise<ProposalResponse> => {
    // retrieve Client and Channel
    const appClient = typeof client === 'string' ? new Client(client) : client;
    const appChannel = typeof channel === 'string' ? new Channel(channel, appClient) : channel;

    // create an identity context
    const idx = appClient.newIdentityContext(user);

    // build the proposal
    const endorsement = appChannel.newEndorsement(chaincode);
    const build_options = {fcn, args};
    const proposalBytes = endorsement.build(idx, build_options);

    // hash the proposal
    const proposalDigest = hashProposal(proposalBytes);

    // calculate the signature
    const signature = calculateSignature({privateKeyPEM, proposalDigest});

    // sign the proposal endorsment
    endorsement.sign(signature);
    
    // send the proposal
    return await endorsement.send();
};