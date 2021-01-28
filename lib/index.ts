import type { GenerateSignedProposalArgs } from '../types';

export const generateSignedProposal = ({
    client,
    user,
    channel,
    chaincode,
    fcn,
    args,
}: GenerateSignedProposalArgs) => {
    const idx = client.newIdentityContext(user);
    const endorsement = channel.newEndorsement(chaincode);
    const build_options = {fcn, args};
    const proposalBytes = endorsement.build(idx, build_options);
    return proposalBytes;
};
