import {CardMedia, Grid, Link as MuiLink, Typography} from '@material-ui/core';

import React from 'react';
import {calculateAgeFromBirthdate} from '../../lib/age-calculator/age-calculator';
import {mail} from 'fluent-mailto';

const jaredblackmanDOB = new Date('1996-06-10');

const mailto = mail.to('djared.xeknau@outlook.com').build();

export type AboutMeContentProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

/**
 * A page of information about me, Jared Michael Blackman.
 */
export function AboutMeContent() {
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        className="text-6xl"
        spacing={5}
      >
        <Grid item>
          <span>{calculateAgeFromBirthdate(jaredblackmanDOB)}</span>
        </Grid>

        <Grid item>
          <span style={{color: '#00a8ff'}}>♂</span>
        </Grid>

        <Grid item>
          <img className="h-12" src="https://i.imgur.com/4Ae8JgG.png" />
        </Grid>
      </Grid>

      <Grid container alignItems="center" justifyContent="center" spacing={5}>
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
    </>
  );
}

export default AboutMeContent;
