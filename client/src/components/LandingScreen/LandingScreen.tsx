import './style.less';

import { Button, Card, Space, Typography } from 'antd';

import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { VantaNetContainer } from './VantaNetContainer/VantaNetContainer';

const { Title } = Typography;

/**
 * The first screen of content which the user will see.
 *
 * @return {JSX.Element}
 */
export function LandingScreen(): JSX.Element {
  return (
    <div className="max-cell">
      <VantaNetContainer className="vanta-net-container">
        <Space className="intro-container" direction="vertical" align="end">
          <Card className="max-cell base-box-shadow">
            <Typography>
              <Title level={1} className="primary-color">
                Jared Michael Blackman
              </Title>
              <Title level={2}>software developer</Title>
            </Typography>
          </Card>

          <nav>
            <ScrollLink to="content-viewport" smooth={true} duration={500}>
              <Button className="base-box-shadow" type="primary">
                read more
              </Button>
            </ScrollLink>
          </nav>
        </Space>
      </VantaNetContainer>
    </div>
  );
}
