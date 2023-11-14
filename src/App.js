import logo from './logo.svg';
import './App.css';
import { Box, AppBar, Toolbar, IconButton, Typography, Button, Container, Hidden, Grid, Tooltip } from '@mui/material';
import { IconMenu2, IconSearch } from '@tabler/icons-react';
import { Search, SearchIconWrapper, StyledInputBase } from './components/Search/Search';
import { useRef, useState, useEffect } from 'react';
import Menu from './components/Menu/Menu';
import { Sidebar, MenuItem } from 'react-pro-sidebar';
import SidebarDrawer from './components/SidebarDrawer/SidebarDrawer';
// import WeatherApp from './pages/test';
import WeatherMap from './components/WeatherMap/WeatherMap';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home/Home';
import SearchPage from './pages/Search/Search';
import InfoPage from './pages/Info/Info';

function App() {
  const appBarRef = useRef(null);
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (appBarRef.current) {
      const height = appBarRef.current.getBoundingClientRect().height;
      setAppBarHeight(height);
    }
  }, []);

  return (
    <Box>
      <SidebarDrawer open={sidebarOpen} onClose={() => {
        setSidebarOpen(false);
      }} />
      <AppBar position="sticky" ref={appBarRef}>
        <Container maxWidth="xl">

          <Toolbar>
            <Hidden lgUp>
              <Tooltip title={sidebarOpen ? "Close Menu" : "Open menu"}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => setSidebarOpen(true)}
                >
                  <IconMenu2 />
                </IconButton>

              </Tooltip>

            </Hidden>
            <Typography variant="h6" component={Link} to={"/"} sx={{ textDecoration: "none", color: "white"}}>
              WeatherAPP
            </Typography>

            <Box sx={{ flexGrow: 1, }}></Box>
            <Hidden mdDown>
              <Search>
                <SearchIconWrapper>
                  <IconSearch />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/search/${e.target.value}`;
                    }
                  }
                  }
                />
              </Search>

            </Hidden>
            <Box sx={{ flexGrow: 1, }}></Box>

            <Button color="inherit" component={Link} to={"/info"}>INFO</Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container sx={{ display: 'flex' }}>
        <Hidden lgDown>
          <Grid item xs="auto" sx={{ height: `calc(100vh - ${appBarHeight}px)`, overflowY: 'auto' }}>
            <Sidebar style={{ height: '100%' }}>
              <Menu />
            </Sidebar>
          </Grid>
        </Hidden>

        <Grid item xs={12} lg sx={{ height: `calc(100vh - ${appBarHeight}px)`, overflowY: 'auto', flexGrow: 1 }}>

          <Routes>
            {/* <Route index element={<WeatherMap maxHeight={`calc(100vh - ${appBarHeight}px)`} />} /> */}
            <Route index element={<Home maxHeight={`calc(100vh - ${appBarHeight}px)`} />} />
            <Route path='search/:city' element={<SearchPage maxHeight={`calc(100vh - ${appBarHeight}px)`} />} />
            <Route path='search' element={<SearchPage maxHeight={`calc(100vh - ${appBarHeight}px)`} />} />
            <Route path='info' element={<InfoPage maxHeight={`calc(100vh - ${appBarHeight}px)`} />} />

          </Routes>

          {/* <Box sx={{ p: 2 }}>
        </Box> */}
        </Grid>
      </Grid>
    </Box >
  );
}

export default App;
