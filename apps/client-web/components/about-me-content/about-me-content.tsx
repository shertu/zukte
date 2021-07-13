import {CardMedia, Link as MuiLink, Typography} from '@material-ui/core';

import React from 'react';
import {calculateAgeFromBirthdate} from '../../lib/age-calculator/age-calculator';
import {mail} from 'fluent-mailto';

const jaredblackmanDOB = new Date('1996-06-10');

const mailto = mail.to('djared.xeknau@outlook.com').build();

/**
 * A page of information about me, Jared Michael Blackman.
 */
export function AboutMeContent() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-row items-center space-x-10 text-6xl h-16">
        <span>{calculateAgeFromBirthdate(jaredblackmanDOB)}</span>
        <span style={{color: '#00a8ff'}}>♂</span>
        <img className="h-12" src="https://i.imgur.com/4Ae8JgG.png" />
      </div>

      <div className="w-full flex flex-row items-center justify-center flex-wrap">
        <div className="w-full max-w-sm m-4">
          <Typography>
            Hello and welcome to my personal website. For those who wish to know
            more about me, please&nbsp;
            <MuiLink href={mailto}>send me an email</MuiLink>
            &nbsp;or&nbsp;
            <MuiLink href="https://www.linkedin.com/in/jared-blackman-71445098/">
              read my LinkedIn profile.
            </MuiLink>
          </Typography>
        </div>
        <CardMedia
          className="w-full max-w-sm m-4 rounded h-52"
          image="https://i.imgur.com/gcWo3ZE.jpg"
        />
      </div>
    </div>
  );
}

export default AboutMeContent;
