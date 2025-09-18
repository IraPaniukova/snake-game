import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          "&:focus": {
            outline: "none", // remove focus outline for contained buttons
          },
        },
        root: {
          "&:focus": {
            outline: "2px solid #1976d2", // for other variants, blue outline
          },
        },
      },
    },
  },
});
