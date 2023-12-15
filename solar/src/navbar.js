// Navbar.js dosyası
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TextField from '@mui/material/TextField';
import { yellow } from '@mui/material/colors';

const Navbar = () => {
    return (
        <AppBar position="fixed"  color="inherit">
            <Toolbar>
                <Brightness7Icon style={{ color: yellow[700] }} />
                <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
                    SIS <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>Solar Information System</span>
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="inherit">Login</Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
