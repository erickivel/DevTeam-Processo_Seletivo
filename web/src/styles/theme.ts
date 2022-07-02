import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    gray: {
      "900": "#181B23",
      "800": "#1A202C",
      "700": "#2D3748",
      "600": "#4A5568",
      "400": "#A0AEC0",
      "50": "#F7FAFC"
    },
    blue: {
      "500": "#385795"
    },
    orange: {
      "500": "#EB7D3D"
    }
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
  styles: {
    global: {
      body: {
        bg: '#F6F6F6',
        color: 'gray.600'
      }
    }
  }
});