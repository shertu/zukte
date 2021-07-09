// #personal-infomation-sex {
//   color: #00a8ff;
// }

import {Box, CardMedia, Typography} from '@material-ui/core';

import React from 'react';
import {calculateAgeFromBirthdate} from '../../lib/utilities/age-calculator';
import {mail} from 'fluent-mailto';

const jaredblackmanDOB = new Date('1996-06-10');
const aboutMeStylePersonalInfoSize = 60;
const aboutMeStyleMaxWidth = 420;

const mailto = mail.to('djared.xeknau@outlook.com').build();

/**
 * A page of information about me, Jared Michael Blackman.
 */
export function AboutMeContent() {
  return (
    <div>
      {/* <Space direction="vertical" align="center" size={0}> */}
      {/* <Space
        split={<Divider type="vertical" />}
        size={aboutMeStylePersonalInfoSize / 1.618}
        style={{marginBottom: aboutMeStylePersonalInfoSize}}
      > */}

      <div className="flex">
        <span>{calculateAgeFromBirthdate(jaredblackmanDOB)}</span>
        <span>♂</span>

        <CardMedia
          image="https://i.imgur.com/4Ae8JgG.png"
          style={{height: '100%'}}
        />
        {/* <Box height={aboutMeStylePersonalInfoSize}>
          <img
            // style={{}}
            src="https://i.imgur.com/4Ae8JgG.png"
          />
        </Box> */}
      </div>

      {/* <Row
        gutter={[48, 60]}
        align="middle"
        justify="center"
        style={{marginLeft: 0, marginRight: 0}}
      > */}
      <div>
        <Typography style={{fontSize: 'large', maxWidth: aboutMeStyleMaxWidth}}>
          <p>Hello and welcome to my personal website.</p>
          <p>
            For those who wish to know more about me, please&nbsp;
            <a href={mailto}>send an email</a>
            &nbsp;or&nbsp;
            <a href="https://www.linkedin.com/in/jared-blackman-71445098/">
              read my LinkedIn
            </a>
            &nbsp;profile.
          </p>
        </Typography>
        <img
          className="image-cover"
          src="https://i.imgur.com/gcWo3ZE.jpg"
          style={{borderRadius: 16, maxWidth: aboutMeStyleMaxWidth}}
        />
      </div>
    </div>
  );
}
