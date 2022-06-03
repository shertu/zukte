import {createTheme} from '@mui/material/styles';
import tailwind from '../../tailwind.config';

const re = /(\d+)px/;

// https://material-ui.com/customization/default-theme/
const theme = createTheme({
  breakpoints: {
    values: {
      lg: parseInt(tailwind.theme.screens.lg.match(re)[1]),
      md: parseInt(tailwind.theme.screens.md.match(re)[1]),
      sm: parseInt(tailwind.theme.screens.sm.match(re)[1]),
      xl: parseInt(tailwind.theme.screens.xl.match(re)[1]),
      xs: 0,
    },
  },
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
});

export default theme;
