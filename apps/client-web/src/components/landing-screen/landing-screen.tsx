import {Button, Card, CardContent, Typography} from '@mui/material';

import React from 'react';
import {Link as ScrollLink} from 'react-scroll';
import {VantaNetContainer} from './vanta-net-container/vanta-net-container';

export interface LandingScreenP {
  /**
   * The id of the HtmlElement to which the read more button will scroll to.
   */
  scrollTo?: string;
}

/**
 * The first screen of content which the user will see.
 */
export function LandingScreen(props: LandingScreenP) {
  return (
    <VantaNetContainer className="h-screen">
      <div className="absolute inset-0 px-6 py-office-word">
        <div className="space-y-4 max-w-lg mx-[20%]">
          <Card className="base-box-shadow">
            <CardContent>
              <Typography
                className="capitalize"
                color="primary"
                variant="h4"
                component="h1"
              >
                Jared Michael Blackman
              </Typography>
              <Typography className="lowercase" variant="h5" component="p">
                professional software developer
              </Typography>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            {props.scrollTo && (
              <ScrollLink to={props.scrollTo} smooth={true} duration={500}>
                <Button variant="contained" color="primary">
                  read more
                </Button>
              </ScrollLink>
            )}
          </div>
        </div>
      </div>
    </VantaNetContainer>
  );
}

export default LandingScreen;
