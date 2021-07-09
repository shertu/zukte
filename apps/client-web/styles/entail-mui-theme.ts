import {createTheme} from '@material-ui/core/styles';
// import tailwindConfig from '../tailwind.config';

// const re = /(\d+)px/;

// https://material-ui.com/customization/default-theme/
const theme = createTheme({
  // palette: {
  //   type: 'dark',
  //   primary: {main: tailwindConfig.theme.extend.colors['entail-yellow']},
  //   secondary: {main: tailwindConfig.theme.extend.colors['entail-red']},
  //   background: {
  //     default: tailwindConfig.theme.extend.colors['entail-base-dark'],
  //     paper: tailwindConfig.theme.extend.colors['entail-base-dark'],
  //   },
  // },
  // typography: {
  //   fontFamily: tailwindConfig.theme.fontFamily.sans.join(','),
  // },
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: parseInt(tailwindConfig.theme.screens.sm.match(re)[1]),
  //     md: parseInt(tailwindConfig.theme.screens.md.match(re)[1]),
  //     lg: parseInt(tailwindConfig.theme.screens.lg.match(re)[1]),
  //     xl: parseInt(tailwindConfig.theme.screens.xl.match(re)[1]),
  //   },
  // },
});

export default theme;
