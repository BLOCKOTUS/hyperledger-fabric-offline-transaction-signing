import { Client, User, Channel, ProposalResponse } from 'fabric-common';
import { KJUR, KEYUTIL } from 'jsrsasign';
import elliptic from 'elliptic'; 

import type { User as UserType } from 'fabric-common';
import type { 
    SendProposalArgs,
    CreateUserArgs,
 } from '../types';

const hashProposal = (proposalBytes: Buffer): string => {
    let md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "sjcl"});
    md.updateString(proposalBytes);
    return md.digest();
};

const calculateSignature = ({
    privateKeyPEM,
    proposalDigest,
}: {
    privateKeyPEM: string,
    proposalDigest: string,
}): Buffer => {
    const key = KEYUTIL.getKey(privateKeyPEM);
    const ec = elliptic.ec;
    const ecdsa = new ec('p256');
    const signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
    const sig = ecdsa.sign(Buffer.from(proposalDigest, 'hex'), signKey);
    const halfOrderSig = preventMalleability(sig, ecdsa);
    const signature = Buffer.from(halfOrderSig.toDER());

    return signature;
};

const preventMalleability = (sig: any, ecdsa: any) => {
    const halfOrder = ecdsa.halfOrder;
    if (!halfOrder) {
        throw new Error('Can not find the half order needed to calculate "s" value for immalleable signatures.');
    }

    if (sig.s.cmp(halfOrder) === 1) {
        const bigNum = ecdsa.order;
        sig.s = bigNum.sub(sig.s);
    }

    return sig;
};

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
    const build_options = { fcn, args };
    const proposalBytes = endorsement.build(idx, build_options);

    // hash the proposal
    const proposalDigest = hashProposal(proposalBytes);

    // calculate the signature
    const signature = calculateSignature({ privateKeyPEM, proposalDigest });

    // sign the proposal endorsment
    endorsement.sign(signature);
    
    // send the proposal
    return await endorsement.send({ targets: appChannel.getEndorsers() });
};