import {Grid, GridProps} from '@mui/material';

import Image from 'next/image';
import React from 'react';
import {differenceInYears} from 'date-fns';

/**
 * Calculates the current age for the specified birth date.
 */
function calculateAgeFromBirthdate(dateOfBirth: Date): number {
  const now = new Date();
  return differenceInYears(now, dateOfBirth);
}

/**
 * A {@link Grid} view of my age, sex and location.
 */
export function AgeSexLocation(props: GridProps) {
  const dob = new Date('1996-06-10');

  return (
    <Grid {...props} container>
      <Grid item className="text-6xl">
        {calculateAgeFromBirthdate(dob)}
      </Grid>

      <Grid item className="text-6xl text-blue-400">
        ♂
      </Grid>

      <Grid item>
        <Image
          src="https://i.imgur.com/4Ae8JgG.png"
          alt="Australia"
          width={51.48}
          height={48}
        />
      </Grid>
    </Grid>
  );
}

export default AgeSexLocation;
