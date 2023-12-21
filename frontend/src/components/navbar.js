import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Backdrop, Box, TextField } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { yellow } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import { LoginService } from '../services/login.service';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = () => {
        // ENV dosyası içerisinden urller çekilmelidir.
        if(LoginService("http://localhost:3001/api/auth/signin", username, password)) handleClose()
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegisterClick = () => {
        setIsRegistering(true);
    };

    const handleLoginClick = () => {
        setIsRegistering(false);
    };

    const currencies = [
        {
            value: 'user',
            label: 'user',
        },
        {
            value: 'admin',
            label: 'admin',
        },
    ];

    return (
        <AppBar position="fixed" color="inherit">
            <Toolbar>
                <Brightness7Icon style={{ color: yellow[700] }} />
                <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
                    SIS <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>Solar Information System</span>
                </Typography>
                <Button color="inherit" onClick={handleOpen}>Login</Button>
            </Toolbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Box
                    sx={{
                        width: 400,
                        height: 520,
                        backgroundColor: 'white',
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
                    {isRegistering ? (
                        // Kayıt formu içeriği
                        <>
                            <Typography variant="h6" sx={{ mb: 2, color: 'grey.800' }}>Kayıt Ol</Typography>
                            <TextField sx={{width: 220}} label="Kullanıcı Adı" margin="normal" />
                            <TextField sx={{width: 220}} label="Mail Adresi" margin="normal" />
                            <TextField sx={{width: 220}}
                                id="outlined-select-currency"
                                select
                                label="Rolünü Seç"
                                defaultValue="user"
                                margin="normal"
                            >
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField 
                                    sx={{width: 220}} 
                                    label="Şifre" 
                                    type="password" 
                                    margin="normal" />
                            <TextField sx={{width: 220}} label="Şifre Onayı" type="password" margin="normal" />
                            <Button variant="outlined"  sx={{ mt: 2 }} >
                                Kayıt Ol
                            </Button>
                            <Button onClick={handleLoginClick} size="small" sx={{marginTop: 2, color: 'grey.800'}}>
                                Zaten hesabım var
                            </Button>
                        </>
                    ) : (
                        // Giriş formu içeriği
                        <>
                            <Typography variant="h6" sx={{ mb: 2, color: 'grey.800' }}>Giriş Yap</Typography>
                            <TextField 
                                    sx={{width: 220}} 
                                    label="Kullanıcı Adı" 
                                    margin="normal" 
                                    onChange={handleUsernameChange}/>
                            <TextField 
                                    sx={{width: 220}} 
                                    label="Şifre" 
                                    type="password" 
                                    margin="normal" 
                                    onChange={handlePasswordChange}/>
                            <Button  variant="outlined" sx={{ mt: 2 }} onClick={handleLogin}>
                                Giriş
                            </Button>
                            <Button onClick={handleRegisterClick}  size="small" sx={{marginTop: 2, color: 'grey.800'}}>
                                Kayıt Ol
                            </Button>
                        </>
                    )}
                </Box>

            </Backdrop>
        </AppBar>
    );
};

export default Navbar;
