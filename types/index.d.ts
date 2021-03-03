import type { Channel, User, Client, ProposalResponse } from 'fabric-common';

export type SendProposalArgs = {
    client: Client,
    channel: Channel,
    user: User,
    privateKeyPEM: string,
    chaincode: string,
    fcn: string,
    args: Array<string>,
};

declare module "hyperledger-fabric-offline-transaction-signing" {
    function sendProposal({client, channel, user, privateKeyPEM, chaincode, fcn, args}: {client?: Client | string, channel?: Channel | string, user: User, privateKeyPEM: string, chaincode: string, fcn: string, args: string}): Promise<ProposalResponse>;
}