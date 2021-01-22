import { Col, Divider, Row, Space, Typography } from "antd";
import * as React from "react";
import Mailto from "react-mailto.js";
import { calculateAgeFromBirthdate } from "../../../utilities/AgeCalculator";
import "./style.less";

const { Paragraph } = Typography;

const shertuDateOfBirth = new Date("1996-06-10");
const aboutMeStyleSpace: number = 0;
const aboutMeStylePersonalInfoSize: number = 60;
const aboutMeStyleMaxWidth: number = 420;

/**
 * A page of information about me, Jared Michael Blackman.
 *
 * @return {JSX.Element}
 */
export function AboutMeContent(): JSX.Element {
  return (
    <Space direction="vertical" align="center" size={aboutMeStyleSpace}>
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
        gutter={[32, 60]}
        align="middle"
        justify="center"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Col>
          <Typography
            style={{ fontSize: "large", maxWidth: aboutMeStyleMaxWidth }}
          >
            <Paragraph>
              Hello and welcome to my personal website. My name is Jared Michael
              Blackman and my profession and occupation is software development.
            </Paragraph>
            <Paragraph>
              For those who wish to know more please&nbsp;
              <Mailto to="djared.xeknau@outlook.com">send me an email</Mailto>
              &nbsp;or&nbsp;
              <a href="https://www.linkedin.com/in/jared-blackman-71445098/">
                check me out on LinkedIn.
              </a>
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
