import { Client, User, Channel, ProposalResponse } from 'fabric-common';
import { KJUR } from 'jsrsasign';

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

export const hashProposal = (proposalBytes: Buffer): String => {
    let md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "sjcl"});
    md.updateString(proposalBytes);
    return md.digest();
};

export const sendProposal = async ({
    client = 'blockotus',
    user,
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
    const signature = null;

    // sign the proposal endorsment
    endorsement.sign(signature);
    
    // send the proposal
    return await endorsement.send();
};