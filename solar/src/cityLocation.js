// cityLocation.js

import React, { useEffect, useState, useRef } from 'react';
import {Paper, Typography, Grid, IconButton, Box, Container, Icon,setShowLocation, show} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { grey } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuIcon from '@mui/icons-material/Menu'; // example icon, replace with your own

const CityLocation = ({lat, lng, show, setShow}) => {
    const handleClose = () => {
        setShow(false); // 'show' state'ini false yaparak Box'ı gizle
    };
    return (
        <Box
            sx={{
                display: show ? 'block' : 'none', // 'show' değerine bağlı olarak display özelliğini ayarla
                position: 'absolute',
                left: 20,
                top: 80,
                p: 2,
                width: 300, // Sabit genişlik değeri
                height: 575, // Sabit yükseklik değeri
                bgcolor: 'white',
                borderRadius: '15px 15px 15px 15px',
            }}
        > {/* Bu satır eklendi */}
            <IconButton onClick={handleClose} sx={{ left: 260 }}>
                <CloseIcon fontSize="small" />
            </IconButton>
            <Grid item>
                <Typography variant="body1">Latitude : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lat}</span></Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">Longitude : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lng}</span></Typography>
            </Grid>
        </Box>
    );
}

export default CityLocation;