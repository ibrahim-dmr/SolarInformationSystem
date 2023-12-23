// cityLocation.js

import * as React from 'react';
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
import { GetCityService } from './services/getCity.service';




const CityLocation = ({lat, lng, show, setShow, ad}) => {
    
    const handleClose = () => {
        setShow(false); // 'show' state'ini false yaparak Box'ı gizle
    };

    const handleSunClick = () => {
        console.log(ad)
        GetCityService("http://localhost:3001/api/query/city", ad)
    }

    const rows = [
        { data: 'DNI', perDay: '10' },
        { data: 'DIF', perDay: '20' },
        { data: 'DNI', perDay: '10' },
        { data: 'DIF', perDay: '20' },
        { data: 'DNI', perDay: '10' },
        { data: 'DIF', perDay: '20' },
        { data: 'DNI', perDay: '10' },
        { data: 'DIF', perDay: '20' },
        // Daha fazla satır eklenebilir...
    ];


        const data = {
            labels: ['PVOUT', 'DNI', 'GHI', 'DIF', 'GTI', 'OPTA', 'TEMP', 'ELE'],
            datasets: [
                {
                    label: 'Enerji Değerleri',
                    data: [20, 10, 30, 15, 25, 35, 40, 45], // Örnek veri, gerçek verilerinizle değiştirin
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };


    const getMapImageUrl = (lat, lng, zoom = 12, size = '400x400') => {
        const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=satellite&key=${GOOGLE_API_KEY}`;
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
            <IconButton onClick={handleClose} sx={{ left: 570 }}>
                <CloseIcon fontSize="small" />
            </IconButton>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Box sx={{
                        borderRadius: '15px',
                        width: 270, // Sabit genişlik değeri
                        height: 200, // Sabit yükseklik değeri
                        overflow: 'hidden', // borderRadius etkisini img üzerinde göstermek için
                        p: 1,
                        bgcolor: 'grey.200',
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
                        width: 270,
                        height: 300,
                        marginTop: 2,
                        p: 1,
                        bgcolor: 'grey.200',
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
                         p={1} bgcolor="grey.200"
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
                    <Box sx={{
                        borderRadius: '15px 15px 15px 15px',
                        width: 270, // Sabit genişlik değeri
                        height: 530, // Sabit yükseklik değeri
                    }}
                        p={1} bgcolor="grey.200">
                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'h6.fontSize', color: 'text.primary' }}>{ad}</Typography>
                        <Typography variant="body1"> <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lat},{lng}</span></Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            İzmir, Türkiye'nin batı kıyısında yer almasıyla yıl boyunca yüksek güneş ışığı alma avantajına sahiptir. Güneşlenme süresinin fazla olması ve bölgedeki radyasyon değerlerinin yüksekliği, İzmir'i solar enerji üretimi için ideal bir konum haline getirir. Özellikle yaz aylarında güneş ışınlarının dik açıyla düşmesi, fotovoltaik panellerden alınabilecek enerji miktarını maksimize eder. Sürdürülebilir ve temiz enerjiye olan ihtiyaç göz önüne alındığında, İzmir ve çevresi, yenilenebilir enerji kaynaklarından yararlanma konusunda büyük bir potansiyele sahiptir. Bu potansiyelin farkında olan yerel yönetimler ve yatırımcılar, bölgede solar
                        </Typography>
                    </Box>
                    <Box sx={{
                        borderRadius: '15px',
                        width: 270, // Sabit genişlik değeri
                        height: 250, // Sabit yükseklik değeri
                        marginTop: 2,
                        p: 1,
                        bgcolor: 'grey.200',
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Potansiyeli En Yüksek
                        </Typography>
                        <List>
                            <ListItem>1. Karşıyaka Sahili</ListItem>
                            <ListItem>2. Çeşme Alaçatı</ListItem>
                            <ListItem>3. Foça Yarımadası</ListItem>
                        </List>
                    </Box>
                    <Box sx={{
                        borderRadius: '15px',
                        width: 270, // Sabit genişlik değeri
                        height: 250, // Sabit yükseklik değeri
                        marginTop: 2,
                        p: 1,
                        bgcolor: 'grey.200',
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