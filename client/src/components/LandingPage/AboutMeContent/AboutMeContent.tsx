import {Divider, Space, Typography} from 'antd';
import * as React from 'react';
import Mailto from 'react-mailto.js';
import { calculateAgeFromBirthdate } from '../../../utilities/AgeCalculator';
import {AutoColumnRow, AutoColumnRowGutterDefault} from '../../AutoColumnRow/AutoColumnRow';
import './style.less';

const {Paragraph} = Typography;

const JARED_DOB = new Date('1996-06-10');
const spaceSize: number = AutoColumnRowGutterDefault;
const personalInformationSize: number = spaceSize + 8;

/**
 * A page of information about me, Jared Michael Blackman.
 *
 * @return {JSX.Element}
 */
export function AboutMeContent(): JSX.Element {
  return (
    <Space direction="vertical" align="center" size={spaceSize}>
      <Space split={<Divider type="vertical" />} size={spaceSize}>
        <Typography id="personal-infomation-age" style={{fontSize: personalInformationSize}}>{calculateAgeFromBirthdate(JARED_DOB)}</Typography>
        <Typography id="personal-infomation-sex" style={{fontSize: personalInformationSize}}>♂</Typography>
        <img id="personal-infomation-location" style={{height: personalInformationSize}} src="https://i.imgur.com/4Ae8JgG.png" />
      </Space>

      <AutoColumnRow gutter={[spaceSize, spaceSize]} align="middle" justify="center">
        <img className="image-cover" src="https://i.imgur.com/gcWo3ZE.jpg" style={{borderRadius: 16, maxWidth: 420}} />

        <Typography className="max-cell-xs" style={{fontSize: 'large'}}>
          <Paragraph>
            Hello, my name is Jared and I am a software developer.
          </Paragraph>
          <Paragraph>
            My skills span a wide range of IT disciplines such as web design, front-end development, back-end development,
            machine learning, and information security. For me, it is important to take products from inception to release
            with the uttermost care and attention to detail in both design and development.
          </Paragraph>
          <Paragraph>
            For those who wish to know more please&nbsp;
            <Mailto to="djared.xeknau@outlook.com" >send me an email.</Mailto>
          </Paragraph>
        </Typography>
      </AutoColumnRow>
    </Space>
  );
}

