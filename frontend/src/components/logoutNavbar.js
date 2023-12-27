import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Backdrop, Box, TextField } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { yellow } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import { LoginService } from '../services/login.service';

const LogoutNavbar = () => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };


    return (
        <AppBar position="fixed" color="inherit">
            <Toolbar>
                <Brightness7Icon style={{ color: yellow[700] }} />
                <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
                    SIS <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>Solar Information System</span>
                </Typography>
                <Button color="inherit" onClick={handleOpen}>Logout</Button>
            </Toolbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Box
                    sx={{
                        width: 400,
                        height: 220,
                        background: 'radial-gradient(circle at bottom, #FFDAB9, #FFDAB9 30%, #FFFFFF 70%, #FFFFFF)',
                        padding: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: 3,
                        borderRadius: '15px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Typography variant="h6" sx={{ mb: 2, color: 'grey.800' }}>Çıkış yapmak istediğine emin misin?</Typography>
                    <Button
                        variant="outlined"
                        sx={{
                            mt: 2,
                            color: 'grey.800', // Metin rengi olarak grey.800
                            borderColor: 'grey.800', // Kenarlık rengi olarak grey.800
                            '&:hover': {
                                backgroundColor: '#FFDAB9', // Üzerine gelindiğinde arka plan rengi olarak soluk sarı
                                borderColor: 'grey.800', // Üzerine gelindiğinde kenarlık rengi olarak grey.800
                            },
                        }}
                        onClick={handleClose}
                    >
                        Çıkış Yap
                    </Button>
                </Box>

            </Backdrop>
        </AppBar>
    );
};

export default LogoutNavbar;
