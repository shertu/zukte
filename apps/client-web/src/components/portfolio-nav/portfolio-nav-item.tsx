import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

import Link from 'next/link';
import React from 'react';

interface PortfolioNavItemP {
  to: string;
  src: string;
  title: string;
  description?: string;
}

/**
 * A {@link Grid} item view which links to an example of my work.
 */
export function PortfolioNavItem(props: PortfolioNavItemP) {
  const {to, src, title, description} = props;
  return (
    <Grid item key={to} className="w-full max-w-sm">
      <Card>
        <Link href={to} passHref>
          <CardActionArea>
            <CardMedia image={src} title={title} className="h-48" />
            <CardContent className="lowercase">
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
}

export default PortfolioNavItem;
