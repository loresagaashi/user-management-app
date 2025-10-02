import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@material-ui/core";
import UsersList from "./pages/UsersList.js";
import UserDetails from "./pages/UserDetails.js";
import AddUser from "./pages/AddUser.js";
import EditUser from "./pages/EditUser.js";

const customTheme = {
  overrides: {
    MuiTableRow: {
      head: {
        background:
          "linear-gradient(90deg, rgba(191,16,0,1) 0%, rgba(209,9,9,1) 28%, rgba(227,99,35,1) 58%, rgba(255,250,37,1) 100%)",
        color: "white",
      },
    },
    MuiTableSortLabel: {
      root: {
        color: "#000",
        fontSize: "1.2em",
        "&:hover": {
          color: "#000 !important",
        },
        "&.MuiTableSortLabel-active": {
          color: "#000",
        },
        "& *": {
          color: "#000 !important",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#DB0007",
      mainGradient:
        "linear-gradient(90deg, rgba(191,16,0,1) 0%, rgba(209,9,9,1) 28%, rgba(227,99,35,1) 58%, rgba(255,250,37,1) 100%)",
    },
    secondary: {
      main: "#FFBC0D",
    },
    text: {
      dark: "#121212",
    },
    type: "light",
  },
  toolbarHeight: 50,
};

function App() {
  return (
    <ThemeProvider theme={createTheme(customTheme)}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar className="d-flex justify-content-between">
          <Typography variant="h6">React Internship</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: 24, marginBottom: 24 }}>
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/add" element={<AddUser />} />
          <Route path="/edit/:id" element={<EditUser />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
