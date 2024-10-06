import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import config from "../../utils/config.js";

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "anticipate" } },
};

const handleLogoutClick = async (setIsLoggedIn) => {
  try {
    await axios.get(`${config.API_BASE_URL}/auth/logout`, { withCredentials: true });
    setIsLoggedIn(false);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const MenuIconButton = ({ to, label, IconComponent, activeStyle }) => (
  <IconButton
    edge="end"
    color="inherit"
    aria-label={label}
    component={NavLink}
    to={to}
    style={({ isActive }) => (isActive ? activeStyle : undefined)}
  >
    <IconComponent sx={{ mr: 2 }} />
  </IconButton>
);

function MenuBar({ isLoggedIn, setIsLoggedIn, onHelpClick, username }) {
  const theme = useTheme();
  const { primary } = theme.palette;

  const activeStyle = {
    color: primary.main,
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={menuVariants}
      style={{ width: '100%' }}
    >
      <AppBar position="fixed" component="header" sx={{ background: '#0CC0DF', height: '64px' }}>
        <Toolbar>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            nAIlGP
          </Typography>

          {isLoggedIn && (
            <>
              <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
                {username}
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="logout"
                onClick={() => handleLogoutClick(setIsLoggedIn)}
              >
                <ExitToAppIcon sx={{ mr: 2 }} />
              </IconButton>
            </>
          )}

          <MenuIconButton
            to="/profile"
            label="account"
            IconComponent={AccountCircleIcon}
            activeStyle={activeStyle}
          />

          <IconButton edge="end" color="inherit" aria-label="help" onClick={onHelpClick}>
            <HelpOutlineIcon sx={{ mr: 2 }} />
          </IconButton>

          <MenuIconButton
            to="/"
            label="home"
            IconComponent={HomeIcon}
            activeStyle={activeStyle}
          />
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default MenuBar;
