import {Card, Col, Row} from 'antd';

import AppRouteCollection from '../../constants/AppRouteCollection';
import {Link} from 'react-router-dom';
import React from 'react';

interface PortfolioNavItemProps {
  to: string;
  src: string;
  title: string;
  description?: string;
}

const portfolioNavItemArr: PortfolioNavItemProps[] = [
  {
    to: AppRouteCollection.AuthenticationDemo,
    src: 'https://i.imgur.com/MawioTF.jpg',
    title: 'authentication demo',
    description: 'where the user can sign in to a web application',
  },
  {
    to: AppRouteCollection.ImageShareDemo,
    src: 'https://i.imgur.com/iHoOXPu.jpg',
    title: 'image share demo',
    description: 'where the user can upload images to blob storage',
  },
  {
    to: AppRouteCollection.MapDemo,
    src: 'https://i.stack.imgur.com/QKlat.png',
    title: 'map demo',
    description: 'where the user can mark locations on a map',
  },
];

/**
 * A nav element which links to various examples of my work.
 *
 * @return {JSX.Element}
 */
export function PortfolioNav(): JSX.Element {
  return (
    <nav>
      <Row>
        {portfolioNavItemArr.map(item => (
          <Col key={item.to} xs={24} md={12} xl={8}>
            <Link to={item.to}>
              <Card hoverable cover={<img src={item.src} />}>
                <Card.Meta title={item.title} description={item.description} />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </nav>
  );
}
