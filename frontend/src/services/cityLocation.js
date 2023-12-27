// cityLocation.js

import React, { useEffect, useState, useRef } from 'react';
import {Paper, Typography, Grid, IconButton, Box, Container, Icon, List, ListItem} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { grey } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuIcon from '@mui/icons-material/Menu'; // example icon, replace with your own
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Radar } from 'react-chartjs-2';
import {GetCityService} from "./cityAPI.service";
import Button from "@mui/material/Button";

const CityLocation = ({lat, lng, show, setShow, ad, selected, apiData}) => {


    const handleClose = () => {
        setShow(false); // 'show' state'ini false yaparak Box'ı gizle
    };

    const getMapImageUrl = (lat, lng, zoom = 12, size = '400x400') => {
        const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=satellite&key=${GOOGLE_API_KEY}`;
    };

    const [ilce1, setilce1] = useState(''); // ilce1 değerini saklayacak state
    const [ilce2, setilce2] = useState(''); // ilce2 değerini saklayacak state
    const [ilce3, setilce3] = useState(''); // ilce3 değerini saklayacak state
    const [ilce4, setilce4] = useState(''); // ilce4 değerini saklayacak state
    const [ilce5, setilce5] = useState(''); // ilce5 değerini saklayacak state
    const [acıklama, setAcıklama] = useState(''); // acıklama değerini saklayacak state
    const [pvout, setPvout] = useState(); // pvout değerini saklayacak state
    const [dni, setDni] = useState(); // dni değerini saklayacak state
    const [ghi, setGhi] = useState(); // ghi değerini saklayacak state
    const [dif, setDif] = useState(); // dif değerini saklayacak state
    const [gti, setGti] = useState(); // git değerini saklayacak state
    const [opta, setOpta] = useState(); // git değerini saklayacak state
    const [temp, setTemp] = useState(); // git değerini saklayacak state


    useEffect(() => {
        if (apiData) {
            const jsonData = JSON.parse(apiData); // String'i JSON objesine dönüştür
            setilce1(jsonData.ilce1); // JSON objesinden ilce1 değerini al ve 'ilce1' state'ine at
            setilce2(jsonData.ilce2); // ilçe 2 verisini çekiyoruz
            setilce3(jsonData.ilce3); // ilçe 3 verisini çekiyoruz
            setilce4(jsonData.ilce4);
            setilce5(jsonData.ilce5);
            setAcıklama(jsonData.explanation);

            // Solar Veriler
            setPvout(jsonData.pvout);
            setDni(jsonData.dni);
            setGhi(jsonData.ghi);
            setDif(jsonData.dif);
            setGti(jsonData.gti);
            setOpta(jsonData.opta);
            setTemp(jsonData.temp);
        }
    }, [apiData]); // apiData değiştiğinde useEffect tetiklenir

    const rows = [
        { data: 'PVOUT', perDay: pvout },
        { data: 'DNI', perDay: dni },
        { data: 'GHI', perDay: ghi },
        { data: 'DIF', perDay: dif },
        { data: 'GTI', perDay: gti },
        { data: 'OPTA', perDay: opta },
        { data: 'TEMP', perDay: temp },

        // Daha fazla satır eklenebilir...
    ];


    const data = {
        labels: ['PVOUT', 'DNI', 'GHI', 'DIF', 'GTI'],
        datasets: [
            {
                label: 'Enerji Değerleri',
                data: [ pvout, dni, ghi, dif, gti], // Örnek veri, gerçek verilerinizle değiştirin
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 0.6)',
                borderWidth: 1,
            },
        ],
    };


    return (
        <Box
            sx={{
                display: show ? 'block' : 'none', // 'show' değerine bağlı olarak display özelliğini ayarla
                position: 'absolute',
                left: 10,
                top: 80,
                p: 2,
                width: 600, // Sabit genişlik değeri
                height: 575, // Sabit yükseklik değeri
                bgcolor: 'white',
                borderRadius: '5px 5px 5px 5px',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 1)', // Kenarlık gölgesi
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
        > {/* Bu satır eklendi */}
            <Grid container spacing={2}>
                <Grid item xs>
                    <Box sx={{
                        borderRadius: '15px',
                        width: 269, // Sabit genişlik değeri
                        height: 200, // Sabit yükseklik değeri
                        overflow: 'hidden', // borderRadius etkisini img üzerinde göstermek için
                        p: 1,
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
                    }}>
                        <Typography variant="body1">
                            <img
                                src="./izmir.jpg"
                                alt="Street View"
                                style={{
                                    width: '100%', // Box'ın genişliğini tamamen kapla
                                    height: '100%', // Box'ın yüksekliğini tamamen kapla
                                    borderRadius: '15px' // Box ile aynı borderRadius'u uygula
                                }}
                            />
                            <Grid item>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'grey',fontSize: '0.8rem' }}>
                                    <IconButton >
                                        <FileDownloadIcon fontSize="small" />
                                    </IconButton>
                                    Download the city's report
                                </Typography>
                            </Grid>
                        </Typography>
                    </Box>
                    <Box sx={{
                        borderRadius: '15px',
                        width: 269,
                        height: 336,
                        marginTop: 2,
                        p: 1,
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
                    }}>
                        <Typography variant="body1">
                            {/* Radar Grafiği */}
                            <Radar data={data} />
                        </Typography>
                    </Box>
                    <Box sx={{
                        borderRadius: '15px',
                        marginTop: 2,
                        width: 270,
                        height: 530,
                        position: 'absolute',
                        overflow: 'auto',
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
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
                         p={1}
                    >
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Data</TableCell>
                                        <TableCell align="right">Per Day</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.data}>
                                            <TableCell component="th" scope="row">
                                                {row.data}
                                            </TableCell>
                                            <TableCell align="right">{row.perDay} </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Box
                        sx={{
                            borderRadius: '15px 15px 15px 15px',
                            width: 270, // Sabit genişlik değeri
                            height: 570, // Sabit yükseklik değeri
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'background.paper', // Kırık beyaz için
                            border: 1, // 1 piksel kenarlık
                            borderColor: 'grey.200', // Gri kenarlık rengi
                            '&:hover': {
                                bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                            },
                        }}
                        p={1}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'h6.fontSize', color: 'text.primary' }}>{ad}</Typography>
                                <Typography variant="body1"> <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lat},{lng}</span></Typography>
                            </div>
                            <IconButton onClick={handleClose} sx={{
                                bottom: 10,
                                left: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.4)', // Şeffaf beyaz arka plan
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Hover durumunda farklı bir şeffaf beyaz tonu
                                }
                            }}>
                            <CloseIcon fontSize="small" />
                            </IconButton>
                        </div>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {acıklama}
                        </Typography>
                    </Box>

                    <Box sx={{
                        borderRadius: '15px',
                        width: 270, // Sabit genişlik değeri
                        height: 250, // Sabit yükseklik değeri
                        marginTop: 2,
                        p: 1,
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Potansiyeli En Yüksek
                        </Typography>
                        <List>
                            <ListItem>1. {ilce1}</ListItem>
                            <ListItem>2. {ilce2}</ListItem>
                            <ListItem>3. {ilce3}</ListItem>
                            <ListItem>4. {ilce4}</ListItem>
                            <ListItem>5. {ilce5}</ListItem>
                        </List>
                    </Box>


                    <Box sx={{
                        borderRadius: '15px',
                        width: 270, // Sabit genişlik değeri
                        height: 250, // Sabit yükseklik değeri
                        marginTop: 2,
                        p: 1,
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
                    }}>
                        <Grid item>
                            <img
                                src={getMapImageUrl(lat, lng)}
                                alt="Street View"
                                style={{ width: '270px', height: '250px',  borderRadius: '15px'}} // Inline style kullanarak genişlik ve yükseklik atama
                            />
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CityLocation;