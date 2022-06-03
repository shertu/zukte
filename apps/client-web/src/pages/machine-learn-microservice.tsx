import {AppHeader, AppPage, RockPaperScissors} from 'components';

import Link from '../components/next-link-composed/next-link-composed';
import React from 'react';
import {Typography} from '@mui/material';

/**
 * The page which demonstrates a machine learn model.
 */
export function MachineLearnMicroservice() {
  return (
    <>
      <AppHeader />
      <AppPage>
        <Typography>
          To use this service please select one of the <i>hands</i> and then
          click the submit button. You can&nbsp;
          <Link href="https://www.youtube.com/watch?v=ND4fd6yScBM">
            watch this video on the rules of rock paper scissors
          </Link>
          &nbsp;to learn more.
        </Typography>
        <RockPaperScissors />
      </AppPage>
    </>
  );
}

export default MachineLearnMicroservice;
