import { UUID } from 'crypto';

export type AccessTokenPayload = {
  uuid: UUID;
  email: string;
};
