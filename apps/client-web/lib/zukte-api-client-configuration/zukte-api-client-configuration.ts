import {Configuration} from '@zukte/api-client';

const config = new Configuration({
  credentials: 'include', // required for CORS authentication
});

export default config;
