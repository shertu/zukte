import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';

import Link from 'next/link';
import React from 'react';

interface PortfolioNavItemProps {
  to: string;
  src: string;
  title: string;
  description?: string;
}

const microservices: string[] = [
  '/authenticate-microservice',
  '/image-share-microservice',
  '/map-microservice',
];

export default microservices;

const portfolioNavItemArr: PortfolioNavItemProps[] = [
  {
    to: microservices[0],
    src: 'https://i.imgur.com/MawioTF.jpg',
    title: 'authentication demo',
    description: 'where the user can sign in to a web application',
  },
  {
    to: microservices[1],
    src: 'https://i.imgur.com/iHoOXPu.jpg',
    title: 'image share demo',
    description: 'where the user can upload images to blob storage',
  },
  {
    to: microservices[2],
    src: 'https://i.stack.imgur.com/QKlat.png',
    title: 'map demo',
    description: 'where the user can mark locations on a map',
  },
];

/**
 * A nav element which links to various examples of my work.
 */
export function PortfolioNav() {
  return (
    <Grid container component="nav" spacing={1} justifyContent="center">
      {portfolioNavItemArr.map(item => (
        <Grid item>
          <Card key={item.to}>
            <Link href={item.to}>
              <CardActionArea>
                <CardMedia
                  image={item.src}
                  title={item.title}
                  className="h-48"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PortfolioNav;
