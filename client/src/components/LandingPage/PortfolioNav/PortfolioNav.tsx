import {Card, Col, Row} from 'antd';
import * as React from 'react';
import {Link} from 'react-router-dom';
import ApplicationRouteCollection from '../../../utilities/ApplicationRouteCollection';

interface PortfolioNavItemProps {
  to?: string,
  src?: string,
  alt?: string,
  title?: string,
  description?: string,
}

const portfolioNavItemArr: PortfolioNavItemProps[] = [{
  to: ApplicationRouteCollection.AuthenticationDemo,
  src: 'https://i.imgur.com/MawioTF.jpg',
  title: 'authentication',
  description: 'A demo where the user can sign in to an application.',
}, {
  to: ApplicationRouteCollection.ImageShareDemo,
  src: 'https://i.imgur.com/iHoOXPu.jpg',
  title: 'image share',
  description: 'A demo where the user can upload and share images with others.',
}, {
  to: ApplicationRouteCollection.MapDemo,
  src: 'https://i.stack.imgur.com/QKlat.png',
  title: 'map',
  description: 'A demo where the user can mark locations on a map.',
}];

/**
 * A nav element which links to various examples of my work.
 *
 * @return {JSX.Element}
 */
export function PortfolioNav(): JSX.Element {
  return (
    <nav>
      <Row>
        {portfolioNavItemArr.map((item) =>
          <Col key={item.to} xs={24} md={12} xl={8} >
            <Link to={item.to}>
              <Card hoverable cover={
                <img src={item.src} alt={item.alt} />
              }>
                <Card.Meta title={item.title} description={item.description} />
              </Card>
            </Link>
          </Col>,
        )}
      </Row>
    </nav>
  );
}
