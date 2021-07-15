import {Button, Card, CardContent, Typography} from '@material-ui/core';

import React from 'react';
import {Link as ScrollLink} from 'react-scroll';
import {VantaNetContainer} from './vanta-net-container/vanta-net-container';

export interface LandingScreenProps {
  readMoreLinkFragment: string;
}

/**
 * The first screen of content which the user will see.
 */
export function LandingScreen(props: LandingScreenProps) {
  const {readMoreLinkFragment} = props;

  return (
    <VantaNetContainer className="h-screen">
      {/* <Space className="intro-container" direction="vertical" align="end"> */}

      <div
        className="absolute space-y-4"
        style={{top: '5.06cm', padding: '0 7.66%'}}
      >
        <Card className="base-box-shadow">
          <CardContent>
            <Typography color="primary" variant="h4" component="h1">
              Jared Michael Blackman
            </Typography>
            <Typography variant="h5" component="p">
              professional software developer
            </Typography>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <ScrollLink to={readMoreLinkFragment} smooth={true} duration={500}>
            <Button variant="contained" color="primary">
              read more
            </Button>
          </ScrollLink>
        </div>
      </div>
    </VantaNetContainer>
  );
}
