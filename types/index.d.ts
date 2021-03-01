import type { Channel, User, Client, ProposalResponse } from 'fabric-common';

export type CreateUserArgs = {
    name: string, 
    password: string, 
    mspid: string, 
    signedCertPEM: string, 
    privateKeyPEM?: string,
};

export type SendProposalArgs = {
    client?: Client | string,
    channel?: Channel | string,
    user: User,
    privateKeyPEM: string,
    chaincode: string,
    fcn: string,
    args: Array<string>,
};

declare module "hyperledger-fabric-offline-transaction-signing" {

    function createUser({name, password, mspid, signedCertPEM, privateKeyPEM}: {name: string, password: string, mspid: string, signedCertPEM: string, privateKeyPEM?: string}): User;
    function sendProposal({client, channel, user, privateKeyPEM, chaincode, fcn, args}: {client?: Client | string, channel?: Channel | string, user: User, privateKeyPEM: string, chaincode: string, fcn: string, args: string}): Promise<ProposalResponse>;
}