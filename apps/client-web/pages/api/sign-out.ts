import {NextApiRequest, NextApiResponse} from 'next';

import {ApplicationUser} from '@entail/api-client';
import {Session} from 'next-iron-session';
import {withSession} from '../../lib/session';

type NextIronRequest = NextApiRequest & {session: Session};

/** With simulate a sign out by destroying the user's session with the Next.js server. */
async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  const accounts: ApplicationUser[] = [];
  req.session.destroy();
  res.json(accounts);
}

export default withSession(handler);
