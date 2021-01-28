import { Client, User, Channel } from 'fabric-common';

import type { User as UserType } from 'fabric-common';
import type { 
    GenerateSignedProposalArgs,
    CreateUserArgs,
 } from '../types';

export const createUser = ({
    name, 
    password,
    mspid,
    signedCertPem,
    privateKeyPEM,
}: CreateUserArgs): UserType => User.createUser(name, password, mspid, signedCertPem, privateKeyPEM);

export const generateSignedProposal = ({
    client,
    user,
    channel,
    chaincode,
    fcn,
    args,
}: GenerateSignedProposalArgs) => {
    const appClient = typeof client === 'string' ? new Client(client) : client;
    const appChannel = typeof channel === 'string' ? new Channel(channel, appClient) : channel;
    const idx = appClient.newIdentityContext(user);
    const endorsement = appChannel.newEndorsement(chaincode);
    const build_options = {fcn, args};
    const proposalBytes = endorsement.build(idx, build_options);
    return proposalBytes;
};
