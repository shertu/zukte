import {Box, Button} from '@material-ui/core';

import {CreateAccountModalOpenContext} from '@entail/business-logic';
import {FrontPageFeed} from '../components/frontpage-feed/frontpage-feed';
import React from 'react';
import {ToolbarOffset} from '../components/toolbar-offset/toolbar-offset';
import styles from './index.module.scss';

/** The home or landing page of the application. */
export function Index() {
  const setOpenCreateAccount = React.useContext(CreateAccountModalOpenContext);

  return (
    <>
      <div className={styles.pageBackground}>
        <ToolbarOffset />
        <div className="flex flex-wrap items-center justify-evenly">
          <Box className="max-w-xl w-full space-y-5">
            <Box fontSize={64} fontWeight={800}>
              What are furries talking about?
            </Box>
            <Box fontSize={24} fontWeight={500}>
              Entail is where furry conversation is kicking off, they’re buying
              + trading awesome items, and finding new events and meets near
              them.
            </Box>
            <Box className="text-black" fontSize={24} fontWeight={500}>
              You in?
            </Box>
            <div className="space-x-3">
              <Button
                variant="contained"
                className="bg-entail-base-dark text-entail-text-dark"
              >
                <Box
                  fontSize={30}
                  fontWeight={800}
                  onClick={() => setOpenCreateAccount(true)}
                >
                  sign up
                </Box>
              </Button>
              <Button variant="contained">
                <Box fontSize={30}>get the app</Box>
              </Button>
            </div>
          </Box>
          <Box className="max-w-xl w-full">
            <FrontPageFeed />
          </Box>
        </div>
      </div>
    </>
  );
}

export default Index;
