/*
My attempts to import the global stylesheet from client-web were unsuccessful.
*/

// import '../../client-web/styles/global.scss';
import 'tailwindcss/tailwind.css';

import React from 'react';

/*
There is a known issue with Materiaul UI / Emotion ^11.0.0 themes and Storybook
https://github.com/mui-org/material-ui/issues/24282
*/
export const decorators = [Story => <Story />];
