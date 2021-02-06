import { ApplicationUser } from '../../../../openapi-generator';
import React from 'react';

interface MineApplicationUserContext {
  mineApplicationUserArr: ApplicationUser[];
  setMineApplicationUserArr: (arr: ApplicationUser[]) => void;
};

const context = React.createContext<MineApplicationUserContext>({
  mineApplicationUserArr: [],
  setMineApplicationUserArr: (arr: ApplicationUser[]) => { },
});

export default context;
