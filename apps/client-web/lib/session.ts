import {Handler, withIronSession} from 'next-iron-session';
import {NextApiRequest, NextApiResponse} from 'next';

const ACCOUNT_COLLECTION_KEY = 'entail-account-collection';

/** withIronSession wrapper with preset values. */
function withSession(handler: Handler<NextApiRequest, NextApiResponse>) {
  if (!process.env.SECRET_COOKIE_PASSWORD) {
    throw new Error(
      'The SECRET_COOKIE_PASSWORD environment variable is not set.'
    );
  }

  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'next.js/examples/with-iron-session',
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

export {withSession, ACCOUNT_COLLECTION_KEY};
