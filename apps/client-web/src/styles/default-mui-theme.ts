import {createTheme} from '@mui/material/styles';
import tailwind from '../../tailwind.config';

const re = /(\d+)px/;

// https://material-ui.com/customization/default-theme/
const theme = createTheme({
  palette: {
    primary: {
      main: '#d8412f',
    },
    secondary: {
      main: '#f5ca99',
    },
  },
  typography: {
    fontFamily: tailwind.theme.fontFamily.sans.join(','),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: parseInt(tailwind.theme.screens.sm.match(re)[1]),
      md: parseInt(tailwind.theme.screens.md.match(re)[1]),
      lg: parseInt(tailwind.theme.screens.lg.match(re)[1]),
      xl: parseInt(tailwind.theme.screens.xl.match(re)[1]),
    },
  },
});

export default theme;
