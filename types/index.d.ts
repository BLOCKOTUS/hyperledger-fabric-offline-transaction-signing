import type { Channel, User, Client } from 'fabric-common';

export type CreateUserArgs = {
    name: string, 
    password: string, 
    mspid: string, 
    signedCertPem: string, 
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
