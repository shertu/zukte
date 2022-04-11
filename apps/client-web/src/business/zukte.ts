import {Configuration} from '@zukte/api-client';

export const ZUKTE_CONFIGURATION = new Configuration({
  credentials: 'include', // required for CORS authentication
});
