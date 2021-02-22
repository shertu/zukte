import './style.less';

import { Col, Divider, Row, Space, Typography } from 'antd';

import Mailto from 'react-mailto.js';
import React from 'react';
import { calculateAgeFromBirthdate } from '../../../utilities/AgeCalculator';

const { Paragraph, Link } = Typography;

const shertuDateOfBirth = new Date('1996-06-10');
const aboutMeStylePersonalInfoSize: number = 60;
const aboutMeStyleMaxWidth: number = 420;

/**
 * A page of information about me, Jared Michael Blackman.
 *
 * @return {JSX.Element}
 */
export function AboutMeContent(): JSX.Element {
  return (
    <Space direction="vertical" align="center" size={0}>
      <Space
        split={<Divider type="vertical" />}
        size={aboutMeStylePersonalInfoSize / 1.618}
        style={{ marginBottom: aboutMeStylePersonalInfoSize }}
      >
        <Typography
          id="personal-infomation-age"
          style={{ fontSize: aboutMeStylePersonalInfoSize }}
        >
          {calculateAgeFromBirthdate(shertuDateOfBirth)}
        </Typography>
        <Typography
          id="personal-infomation-sex"
          style={{ fontSize: aboutMeStylePersonalInfoSize }}
        >
          ♂
        </Typography>
        <img
          id="personal-infomation-location"
          style={{ height: aboutMeStylePersonalInfoSize }}
          src="https://i.imgur.com/4Ae8JgG.png"
        />
      </Space>

      <Row
        gutter={[48, 60]}
        align="middle"
        justify="center"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Col>
          <Typography
            style={{ fontSize: 'large', maxWidth: aboutMeStyleMaxWidth }}
          >
            <Paragraph>
              Hello and welcome to my personal website.
            </Paragraph>
            <Paragraph>
              For those who wish to know more about me, 
              please <Mailto to="djared.xeknau@outlook.com">send me an email</Mailto> or 
              read my <Link href="https://www.linkedin.com/in/jared-blackman-71445098/">LinkedIn</Link> profile.
            </Paragraph>
            <Paragraph>
              My preferred software development languages 
              are <Link href="https://dotnet.microsoft.com/">.NET</Link> and <Link href="https://www.typescriptlang.org/">TypeScript.</Link>
            </Paragraph>
          </Typography>
        </Col>

        <Col>
          <img
            className="image-cover"
            src="https://i.imgur.com/gcWo3ZE.jpg"
            style={{ borderRadius: 16, maxWidth: aboutMeStyleMaxWidth }}
          />
        </Col>
      </Row>
    </Space>
  );
}
