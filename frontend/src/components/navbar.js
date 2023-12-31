import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Backdrop, Box, TextField } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { yellow } from '@mui/material/colors';
import { LoginAPIService } from '../services/loginAPI.service';
import { RegisterAPIService } from '../services/registerAPI.service';
import Search from './search'
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const Navbar = ({panTo}) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pwOnay, setPwOnay] = useState('');
    const [email, setEmail] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handlePwOnayChange = (e) => {
        setPwOnay(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const resetForm = () =>{
        setUsername("");
        setPassword("");
        setPwOnay("");
        setEmail("");
    }

    const handleLogin = () => {
        // ENV dosyası içerisinden urller çekilmelidir.
        if(LoginAPIService("http://localhost:3001/api/auth/signin", username, password)) {
            resetForm();
            handleClose();
            // ! DİKKAT ! eğer başarılı login olduysa sayfayı otomatik yenilemek gerekiyor
            // window.location.reload(); // Sayfayı yeniden yükler (Tüm sayfa yüklenir)
            // doğru yol sanırım react state managment kullanımı bunu nasıl yapacağımıza odaklanmalıyız
        }

    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleSignUp = () => {
        if(password === pwOnay){
            if(RegisterAPIService("http://localhost:3001/api/auth/signup", username, password, email)){
                resetForm();
                setIsRegistering(false);
            }
            console.log(username);
            console.log(password);
            console.log(email);
        }
    }


    const handleRegisterClick = () => {
        setIsRegistering(true);
    };

    const handleLoginClick = () => {

        setIsRegistering(false);
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <AppBar position="fixed" color="inherit">
            <Toolbar>
                <Brightness7Icon style={{ color: yellow[700] }} />
                <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
                    SIS <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>Solar Information System</span>
                </Typography>
                <Search color="inherit" panTo={panTo}/>
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
                        background: 'radial-gradient(circle at bottom, #FFF9C4, #FFF9C4 30%, #FFFFFF 70%, #FFFFFF)', // Güneşin alttan yukarıya doğru doğuşu efekti
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
                            <TextField
                                sx={{
                                    width: 220,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700', // Odaklandığında kenarlık rengi
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'black', // Odaklandığında etiket rengi
                                    },
                                    '& label': {
                                        color: 'black', // Normal etiket rengi
                                    },
                                }}
                                label="Kullanıcı Adı"
                                onChange={handleUsernameChange}
                                margin="normal"
                                value={username}
                            />
                            <TextField
                                sx={{
                                    width: 220,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700', // Odaklandığında kenarlık rengi
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'black', // Odaklandığında etiket rengi
                                    },
                                    '& label': {
                                        color: 'black', // Normal etiket rengi
                                    },
                                }}
                                label="Mail Adresi"
                                onChange={handleEmailChange}
                                margin="normal"
                                value={email}

                            />
                            <TextField
                                sx={{
                                    width: 220,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700', // Odaklandığında kenarlık rengi
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'black', // Odaklandığında etiket rengi
                                    },
                                    '& label': {
                                        color: 'black', // Normal etiket rengi
                                    },
                                }}
                                label="Şifre"
                                onChange={handlePasswordChange}
                                type="password"
                                margin="normal"
                                value={password}
                            />
                            <TextField
                                sx={{
                                    width: 220,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700', // Odaklandığında kenarlık rengi
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'black', // Odaklandığında etiket rengi
                                    },
                                    '& label': {
                                        color: 'black', // Normal etiket rengi
                                    },
                                }}
                                label="Şifre Onayı"
                                onChange={handlePwOnayChange}
                                type="password"
                                margin="normal"
                                value={pwOnay}
                            />
                            <Button
                                variant="outlined"
                                onClick={handleSignUp}
                                sx={{
                                    mt: 2,
                                    color: '#FFD700', // Metin rengi olarak açık sarı
                                    borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                    '&:hover': {
                                        backgroundColor: '#FFF9C4', // Üzerine gelindiğinde arka plan rengi olarak soluk sarı
                                        borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi olarak açık sarı
                                    },
                                }}
                            >
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
                                sx={{
                                    width: 220,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700', // Odaklandığında kenarlık rengi
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'black', // Odaklandığında etiket rengi
                                    },
                                    '& label': {
                                        color: 'black', // Normal etiket rengi
                                    },
                                }}
                                label="Kullanıcı Adı"
                                margin="normal"
                                onChange={handleUsernameChange}
                                value={username}
                            />
                            <TextField
                                sx={{
                                    width: 220,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700', // Odaklandığında kenarlık rengi
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'black', // Odaklandığında etiket rengi
                                    },
                                    '& label': {
                                        color: 'black', // Normal etiket rengi
                                    },
                                }}
                                label="Şifre"
                                type={showPassword ? 'text' : 'password'}
                                margin="normal"
                                onChange={handlePasswordChange}
                                value={password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />


                            <Button
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    color: '#FFD700', // Metin rengi olarak açık sarı
                                    borderColor: '#FFD700', // Kenarlık rengi olarak açık sarı
                                    '&:hover': {
                                        backgroundColor: '#FFF9C4', // Üzerine gelindiğinde arka plan rengi olarak soluk sarı
                                        borderColor: '#FFD700', // Üzerine gelindiğinde kenarlık rengi olarak açık sarı
                                    },
                                }}
                                onClick={handleLogin} // onClick olay işleyicisi
                            >
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