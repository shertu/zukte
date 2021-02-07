import { ApplicationUser } from '../../../../openapi-generator';
import React from 'react';

// interface MineApplicationUserContext {
//   mineApplicationUserArr: ApplicationUser[];
// };

const context = React.createContext<ApplicationUser[]>([]);

export default context;
