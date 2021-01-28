import type { User } from 'fabric-common';

export type GenerateSignedProposalProps = {
    user: User,
    args: Array<string>,
};