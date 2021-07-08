import {ACCOUNT_COLLECTION_KEY, withSession} from '../../lib/session';
import {NextApiRequest, NextApiResponse} from 'next';

import {ApplicationUser} from '@entail/api-client';
import {Session} from 'next-iron-session';

type NextIronRequest = NextApiRequest & {session: Session};

/** Get the list of accounts stored in the session on the Next.js server. */
async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  const accounts: ApplicationUser[] =
    req.session.get(ACCOUNT_COLLECTION_KEY) ?? [];
  res.json(accounts);
}

export default withSession(handler);
