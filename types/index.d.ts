import type { Channel, Client, User } from 'fabric-common';

export type CreateUserArgs = {
    name: string, 
    password: string, 
    mspid: string, 
    signedCertPem: string, 
    privateKeyPEM?: string,
};

export type GenerateSignedProposalArgs = {
    client: Client,
    user: User,
    chaincode: string,
    channel: Channel,
    fcn: string,
    args: Array<string>,
};
