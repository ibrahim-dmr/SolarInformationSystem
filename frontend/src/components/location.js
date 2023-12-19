// location.js
import React, { useEffect, useState, useRef } from 'react';
import {Paper, Typography, Grid, IconButton, Box, Container, Icon,setShowLocation, show} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { grey } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuIcon from '@mui/icons-material/Menu'; // example icon, replace with your own

const Location = ({lat, lng, solarData, time, locationname, dniArray, dwnArray, dıfArray,setShow,show}) => {
    // Date nesnesini string'e dönüştürmek
    const formattedTime = time ? time.toLocaleString() : '';
    const getMapImageUrl = (lat, lng, zoom = 12, size = '400x400') => {
        const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=satellite&key=${GOOGLE_API_KEY}`;
    };

    const chartRef = useRef(null); // Ref to store the Chart instance

    const UTILS = {
        months:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };


    useEffect(() => {
        // DNI ve DWN array verileri mevcutsa Line Chart oluştur
        if (dniArray && dwnArray && dıfArray) {
            // Önce mevcut Chart nesnesini yok et
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const ctx = document.getElementById('dniChart');

            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: UTILS.months,
                    datasets: [
                        {
                            label: 'DNI Values',
                            data: Object.values(dniArray),
                            borderColor: 'rgba(255, 68, 68, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'DWN Values',
                            data: Object.values(dwnArray),
                            borderColor: 'rgba(51, 153, 255, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'DIF Values',
                            data: Object.values(dıfArray),
                            borderColor: 'rgba(0, 255, 153, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value',
                            },
                        },
                    },
                    responsive: true, // Responsive tasarım
                    maintainAspectRatio: false // Oranı koruma
                },
            });
        }
    }, [dniArray, dwnArray, dıfArray]);


    const downloadData = () => {
        const fileName = "solarData.json";
        const json = JSON.stringify(solarData);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        // Create a link element, use it to download the file and remove it
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const handleClose = () => {
        setShow(false); // 'show' state'ini false yaparak Box'ı gizle
    };
    return (

        <Box
            sx={{
                display: show ? 'block' : 'none', // 'show' değerine bağlı olarak display özelliğini ayarla
                position: 'absolute',
                right: 20,
                top: 80,
                p: 2,
                width: 300, // Sabit genişlik değeri
                height: 575, // Sabit yükseklik değeri
                bgcolor: 'white',
                borderRadius: '15px 15px 15px 15px',
                overflow: 'auto', // İçerik kutunun boyutunu aştığında kaydırma çubuğu görünür
                '&::-webkit-scrollbar': {
                    width: '10px',
                    borderRadius: '5px',
                    backgroundColor: `rgba(0, 0, 0, 0.1)`,
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: `rgba(0, 0, 0, 0.2)`,
                    borderRadius: '5px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: `rgba(0, 0, 0, 0.3)`,
                },
            }}
        >
            <IconButton onClick={handleClose} sx={{ left: 260 }}>
                <CloseIcon fontSize="small" />
            </IconButton>
            <Container maxWidth="sm">
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <img src={getMapImageUrl(lat, lng)} alt="Street View" />
                    </Grid>
                    <Box>
                    <Grid item>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'h6.fontSize', color: 'text.primary' }}>
                            {locationname}
                        </Typography>
                    </Grid>
                    </Box>
                    <Grid item>
                        <Typography variant="body1">Latitude : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lat}</span></Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">Longitude : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lng}</span></Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            DNI : {dniArray[dniArray.length - 1]} <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>kWh/m²</span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">DWN : {dwnArray[dwnArray.length - 1]} <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>kWh/m²</span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">DIF : {dıfArray[dıfArray.length - 1]} <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>kWh/m²</span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box sx={{ maxHeight: "240px", maxWidth: "240px" }}> {/* Boyutları iki katına çıkarıldı */}
                            <canvas id="dniChart" width="400" height="400"></canvas> {/* Piksel cinsinden genişlik ve yükseklik ayarlandı */}
                        </Box>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'grey',fontSize: '0.8rem' }}>
                            <IconButton onClick={downloadData}>
                                <FileDownloadIcon fontSize="small" />
                            </IconButton>
                            added at {formattedTime}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Location;
