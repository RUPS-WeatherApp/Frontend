import logo from './logo.svg';
import './App.css';
import { Box, AppBar, Toolbar, IconButton, Typography, Button, Container, Hidden, Grid, Tooltip } from '@mui/material';
import { IconMenu2, IconSearch } from '@tabler/icons-react';
import { Search, SearchIconWrapper, StyledInputBase } from './components/Search/Search';
import { useRef, useState, useEffect } from 'react';
import Menu from './components/Menu/Menu';
import { Sidebar, MenuItem } from 'react-pro-sidebar';
import SidebarDrawer from './components/SidebarDrawer/SidebarDrawer';
import WeatherApp from './pages/test';
import WeatherMap from './components/WeatherMap/WeatherMap';

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
            <Typography variant="h6" component="div">
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
                />
              </Search>

            </Hidden>
            <Box sx={{ flexGrow: 1, }}></Box>

            <Button color="inherit">INFO</Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container>

        <Hidden lgDown>
          <Grid item xs={12} lg={4} xl={3} sx={{ height: `calc(100vh - ${appBarHeight}px)`, overflowY: "auto" }}>

            <Sidebar style={{ height: '100%' }}>
              <Menu />
            </Sidebar>
          </Grid>
        </Hidden>

        <Grid item xs={12} lg={8} xl={9} sx={{ height: `calc(100vh - ${appBarHeight}px)`, overflowY: "auto" }} >

          <Box sx={{ p: 2, height: "100" }}>
              <WeatherMap />
            <Typography variant="h6" component="div">
              Dashboard
            </Typography>

            <Box sx={{ mt: 2, }}>
              Content

              <WeatherApp />
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Box >
  );
}

export default App;
