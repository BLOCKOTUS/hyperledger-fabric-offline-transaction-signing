import * as fc from 'fabric-common';

import type { GenerateSignedProposalProps } from '../types';

export const generateSignedProposal = ({
    user,
    args,
}:  GenerateSignedProposalProps) => {
    const idx = client.newIdentityContext(user);
    const endorsement = channel.newEndorsement(chaincode_name);
};
