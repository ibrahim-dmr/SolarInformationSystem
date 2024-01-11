// townLocation.js

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

const TownLocation = ({lat, lng, show, setShow, ad, selected, sehir, apiData}) => {

    const handleClose = () => {
        setShow(false); // 'show' state'ini false yaparak Box'ı gizle
    };

    const getMapImageUrl = (lat, lng, zoom = 12, size = '400x400') => {
        const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=satellite&key=${GOOGLE_API_KEY}`;
    };

    const [pvout, setPvout] = useState(0); // pvout için başlangıç değeri olarak 0
    const [dni, setDni] = useState(0); // dni için başlangıç değeri olarak 0
    const [ghi, setGhi] = useState(0); // ghi için başlangıç değeri olarak 0
    const [dif, setDif] = useState(0); // dif için başlangıç değeri olarak 0
    const [gti, setGti] = useState(0); // gti için başlangıç değeri olarak 0
    const [opta, setOpta] = useState(0); // opta için başlangıç değeri olarak 0
    const [temp, setTemp] = useState(0); // temp için başlangıç değeri olarak 0
    const [acıklama, setAcıklama] = useState(''); // acıklama değerini saklayacak state

    useEffect(() => {
        if (apiData) {
            const jsonData = apiData; // String'i JSON objesine dönüştür
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
                data: [pvout, dni, ghi, dif, gti], // Örnek veri, gerçek verilerinizle değiştirin
                backgroundColor: 'rgba(128, 0, 128, 0.2)', // Koyu mor arka plan rengi
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
        >
            <Grid container spacing={2}>
                <Grid item xs>
                    <Box sx={{
                        borderRadius: '5px',
                        width: 269, // Sabit genişlik değeri
                        height: 268, // Sabit yükseklik değeri
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
                                src={`/ElazigIlceleri/${lat}.jpg`}
                                alt="Street View"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '5px'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null; // sonsuz döngüyü önlemek için
                                    e.target.src = 'https://via.placeholder.com/500x500'; // Varsayılan resim yolu
                                }}
                            />
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Box sx={{
                        borderRadius: '5px',
                        width: 270, // Sabit genişlik değeri
                        height: 268, // Sabit yükseklik değeri
                        p: 1,
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
                    }}>
                        <Grid item sx={{ position: 'relative', width: '270px', height: '270px' }}>
                            <IconButton
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0, // Sağ üst köşe için bu özelliği kullanın
                                    zIndex: 100,
                                    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Şeffaf beyaz arka plan
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Hover durumunda farklı bir şeffaf beyaz tonu
                                    }
                                }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                            <img
                                src={getMapImageUrl(lat, lng)}
                                alt="Street View"
                                style={{ width: '270px', height: '270px', borderRadius: '15px'}} // Inline style kullanarak genişlik ve yükseklik atama
                            />
                        </Grid>
                    </Box>
                </Grid>
                <Box sx={{
                    borderRadius: '5px',
                    width: 577, // Dış Box genişliği
                    height: 250,
                    marginLeft: 2,
                    marginTop: 2,
                    p: 1,
                    bgcolor: 'background.paper', // Kırık beyaz için
                    border: 1, // 1 piksel kenarlık
                    borderColor: 'grey.200', // Gri kenarlık rengi
                    '&:hover': {
                        bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                    },
                    display: 'flex',
                    flexDirection: 'column', // Dikey olarak dizilim
                }}>
                    <div>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'h6.fontSize', color: 'text.primary' }}>{ad}</Typography>
                        <Typography variant="body1"> <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{sehir}</span></Typography>
                        <Typography variant="body1"> <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lat},{lng}</span></Typography>
                    </div>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {acıklama}
                    </Typography>
                </Box>
                <Grid item xs>
                    <Box sx={{
                        borderRadius: '5px',
                        width: 270,
                        height: 240,
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
                                        <TableCell>Veri</TableCell>
                                        <TableCell align="right">Günlük Ortalama</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.data}>
                                            <TableCell component="th" scope="row">
                                                {row.data}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.perDay}
                                                {row.data === 'PVOUT' && ' kWh/kWp'}
                                                {(row.data === 'DNI' || row.data === 'GHI' || row.data === 'DIF' || row.data === 'GTI') && ' kWh/m2'}
                                                {row.data === 'OPTA' && '°'}
                                                {row.data === 'TEMP' && '°C'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>


                </Grid>
                <Grid item xs>
                    <Box sx={{
                        borderRadius: '15px',
                        width: 269,
                        height: 268,
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
                </Grid>

            </Grid>
        </Box>
    );
}

export default TownLocation;