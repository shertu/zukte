import {
  CardMedia,
  Grid,
  GridProps,
  Link as MuiLink,
  Typography,
} from '@mui/material';

import React from 'react';
import {mail} from 'fluent-mailto';

/**
 * A {@link Grid} view of information about me including a short description and photo.
 */
export function AboutMeContent(props: GridProps) {
  const mailto = mail.to('djared.xeknau@outlook.com').build();

  return (
    <Grid container {...props}>
      <Grid item className="w-full max-w-sm">
        <Typography>
          Hello and welcome to my personal website. For those who wish to know
          more about me, please&nbsp;
          <MuiLink href={mailto}>send me an email</MuiLink>
          &nbsp;or&nbsp;
          <MuiLink href="https://www.linkedin.com/in/jared-blackman-71445098/">
            read my LinkedIn profile.
          </MuiLink>
        </Typography>
      </Grid>
      <Grid item className="w-full max-w-sm">
        <CardMedia
          className="rounded h-52"
          image="https://i.imgur.com/gcWo3ZE.jpg"
        />
      </Grid>
    </Grid>
  );
}

export default AboutMeContent;
