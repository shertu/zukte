import {ACCOUNT_COLLECTION_KEY, withSession} from '../../lib/session';
import {NextApiRequest, NextApiResponse} from 'next';

import {ApplicationUser} from '@entail/api-client';
import {Session} from 'next-iron-session';

type NextIronRequest = NextApiRequest & {session: Session};

/** Will simulate a sign in by adding a fake account to the user's session. */
async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  const accounts: ApplicationUser[] = [
    {
      id: '0d940a6a-e335-4a70-a899-3a039117b4a2',
      picture: 'https://picsum.photos/500',
    },
  ];

  req.session.set(ACCOUNT_COLLECTION_KEY, accounts);
  await req.session.save();
  res.json(accounts);
}

export default withSession(handler);
