import { KEYUTIL } from 'jsrsasign';
import { ec } from 'elliptic'; 

import type { ProposalResponse } from 'fabric-common';

import type { 
    SendProposalArgs,
} from '../types';

const calculateSignature = ({
    privateKeyPEM,
    proposalDigest,
}: {
    privateKeyPEM: string,
    proposalDigest: string,
}): Buffer => {
    const key = KEYUTIL.getKey(privateKeyPEM);
    const ecdsa = new ec('p256');
    const signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
    const sig = ecdsa.sign(Buffer.from(proposalDigest, 'hex'), signKey);
    const halfOrderSig = preventMalleability(sig, ecdsa);
    const signature = Buffer.from(halfOrderSig.toDER());
    return signature;
};

const preventMalleability = (sig: any, ecdsa: any) => {
    const halfOrder = ecdsa.n.shrn(1);
    if (sig.s.cmp(halfOrder) === 1) {
        const bigNum = ecdsa.n;
        sig.s = bigNum.sub(sig.s);
    }
    return sig;
};

export const sendProposal = ({
    client,
    user,
    privateKeyPEM,
    channel,
    chaincode,
    fcn,
    args,
}: SendProposalArgs): Promise<ProposalResponse> => {
    // create an identity context
    const idx = client.newIdentityContext(user);

    // build the proposal
    const endorsement = channel.newEndorsement(chaincode);
    const build_options = { fcn, args };
    const proposalBytes = endorsement.build(idx, build_options);

    // hash the proposal
    const proposalDigest = user.getCryptoSuite().hash(proposalBytes.toString(), { algorithm: 'SHA2' });

    // calculate the signature
    const signature = calculateSignature({ privateKeyPEM, proposalDigest });

    // sign the proposal endorsment
    endorsement.sign(signature);

    // send the proposal
    return endorsement.send({ targets: channel.getEndorsers() });
};
