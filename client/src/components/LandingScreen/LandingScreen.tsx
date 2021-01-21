import {Button, Card, Row, Space, Typography} from 'antd';
import * as React from 'react';
import * as Scroll from 'react-scroll';
import './style.less';
import {VantaNetContainer} from './VantaNetContainer/VantaNetContainer';

const {Title} = Typography;

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
              <Title level={1} className="primary-color">Jared Michael Blackman</Title>
              <Title level={2}>Software Developer</Title>
            </Typography>
          </Card>

          <nav>
            <Scroll.Link to="content-viewport" smooth={true} duration={500}>
              <Button className="base-box-shadow" type="primary">read more</Button>
            </Scroll.Link>
          </nav>
        </Space>
      </VantaNetContainer>
    </div>
  );
}

