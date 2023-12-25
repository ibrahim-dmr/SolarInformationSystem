// location.js
import React, { useEffect, useState, useRef } from 'react';
import {Paper, Typography, Grid, IconButton, Box, Container, Icon} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { grey } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuIcon from '@mui/icons-material/Menu';
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody"; // example icon, replace with your own
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {fetchSolarData} from "./solarData";
import { getLocationName } from './getLocationName';
import { GetCityService } from './getCity.service';
import Menu from '@mui/material/Menu';

const Location = ({selected, lat, lng,  time, setShow, show}) => {
    // Date nesnesini string'e dönüştürmek
    const formattedTime = time ? time.toLocaleString() : '';
    const getMapImageUrl = (lat, lng, zoom = 19, size = '400x400') => {
        const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=satellite&key=${GOOGLE_API_KEY}`;
    };

    const chartRef = useRef(null); // Ref to store the Chart instance

    const UTILS = {
        months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    };
    const [solarDataa, setSolarDataa] = useState(null);
    const [dniArrayy, setDniArrayy] = useState([]);
    const [dwnArrayy, setDwnArrayy] = useState([]);
    const [dıfArrayy, setDıfArrayy] = useState([]);
    const [locationNamee, setLocationNamee] = useState('');

    useEffect(() => {
        if (selected) {
            fetchSolarData(selected.lat, selected.lng)
                .then(data => {
                    setSolarDataa(data);
                    if (data && data.dni) {
                        const dniValues = Object.values(data.dni);
                        const dwnValues = Object.values(data.swdwn);
                        const dıfValues = Object.values(data.dıf);
                        setDniArrayy(dniValues);
                        setDwnArrayy(dwnValues);
                        setDıfArrayy(dıfValues);
                    }
                })
                .catch(error => console.error('Error fetching solar data:', error));
        }
    }, [selected]);

    useEffect(() => {
        if (selected) {
            getLocationName(selected.lat, selected.lng)
                .then(name => {
                    setLocationNamee(name); // Çekilen konum ismini state'e kaydet
                })
                .catch(error => console.error('Error fetching location name:', error));
        }
    }, [selected]);

    useEffect(() => {
        // DNI ve DWN array verileri mevcutsa Line Chart oluştur
        if (dniArrayy && dwnArrayy && dıfArrayy) {
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
                            data: Object.values(dniArrayy),
                            borderColor: 'rgba(255, 68, 68, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'DWN Values',
                            data: Object.values(dwnArrayy),
                            borderColor: 'rgba(51, 153, 255, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'DIF Values',
                            data: Object.values(dıfArrayy),
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
    }, [dniArrayy, dwnArrayy, dıfArrayy]);


    const handleClose = () => {
        setShow(false); // 'show' state'ini false yaparak Box'ı gizle
        handleCloseMenu();
    };

    const rows = [
        { data: 'DNI', yearlyAverage: dniArrayy[dniArrayy.length - 1] },
        { data: 'DWN', yearlyAverage: dwnArrayy[dwnArrayy.length - 1] },
        { data: 'DIF', yearlyAverage: dıfArrayy[dıfArrayy.length - 1] },
        // Daha fazla satır eklenebilir...
    ];

    const currencies = [
        {
            value: 'sml',
            label: 'small',
        },
        {
            value: 'nrm',
            label: 'normal',
        },
        {
            value: 'big',
            label: 'big',
        },
    ];

    //YILLIK ENERJİ HESABI
    const [selectedCurrency, setSelectedCurrency] = useState('sml');
    const [quantity, setQuantity] = useState('');

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const [yearlyAverage, setYearlyAverage] = useState(0);


    // Yıllık ortalama değeri hesaplamak için bir fonksiyon (Bu kısım projenize göre değişebilir)
    const panelSizes = {
        sml: 1.5,  // Küçük panel boyutu m²
        nrm: 6,  // Normal panel boyutu m²
        big: 6   // Büyük panel boyutu m²
    };

    const PR = 0.80; // Performans Oranı (%80)

    const calculate = () => {
        const panelSize = panelSizes[selectedCurrency] || 0; // Seçilen panel tipine göre boyut
        const panelCount = parseInt(quantity) || 0; // Panel sayısı
        const G = dniArrayy[dniArrayy.length - 1]; // Son DNI değeri

        // Yıllık enerji üretimi hesaplama
        const yearlyEnergy = panelSize * panelCount * G * PR;
        const formattedYearlyEnergy = parseFloat(yearlyEnergy.toFixed(2)); // Noktalı virgülden sonra iki basamakla sınırla ve float'a dönüştür

        setYearlyAverage(formattedYearlyEnergy);

        // Konsola yazdırma (isteğe bağlı)
        console.log(`Panel Tipi: ${selectedCurrency}, Adet: ${quantity}, Yıllık Enerji Üretimi: ${formattedYearlyEnergy}`);
    };



    const handleSunClick = () => {
        console.log(selected)
        console.log(selected.ad)
        if(selected && selected.icon === 'sun_location.svg'){
            GetCityService("http://localhost:3001/api/query/city", selected.ad)
        }
    }

    // Menu için gerekli state ve fonksiyonlar
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // JSON formatında indirme
    const downloadJSON = (data, fileName) => {
        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: "application/json" });
        downloadBlob(blob, fileName + ".json");
    };

// CSV formatında indirme (CSV dönüşümü için bir fonksiyon gerekecek)
    const downloadCSV = (csvString, fileName) => {
        const blob = new Blob([csvString], { type: "text/csv" });
        downloadBlob(blob, fileName + ".csv");
    };



// Blob olarak indirme işlemini yapan genel fonksiyon
    const downloadBlob = (blob, fileName) => {
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const convertArraysToCSV = (dniArrayy, dwnArrayy, difArrayy) => {
        // Üç dizinin de aynı uzunlukta olduğunu varsayıyoruz
        if (dniArrayy.length !== dwnArrayy.length || dniArrayy.length !== difArrayy.length) {
            console.error('Dizilerin uzunlukları eşit değil');
            return '';
        }

        let csvString = "DNI,DWN,DIF\n"; // Sütun başlıkları

        // Dizileri birleştirerek CSV formatına dönüştürme
        for (let i = 0; i < dniArrayy.length; i++) {
            csvString += `${dniArrayy[i]},${dwnArrayy[i]},${difArrayy[i]}\n`;
        }

        return csvString;
    };




    const handleDownload = (format) => {
        const fileName = "solarData"; // Varsayılan dosya adı
        switch (format) {
            case 'json':
                // Birden fazla diziyi bir nesnede birleştirme
                const jsonData = {
                    dniData: dniArrayy,
                    dwnData: dwnArrayy,
                    difData: dıfArrayy
                };
                // JSON olarak indirme
                downloadJSON(jsonData, fileName);
                break;
            case 'csv':
                const csvData = convertArraysToCSV(dniArrayy, dwnArrayy, dıfArrayy);
                downloadCSV(csvData, fileName);
                break;
            default:
                console.error('Bilinmeyen format');
        }
        handleClose();
    };



    return (
        <Box
            sx={{
                display: show ? 'block' : 'none', // 'show' değerine bağlı olarak display özelliğini ayarla
                position: 'absolute',
                right: 10,
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
        >
            <IconButton onClick={handleClose} sx={{ left: 570 }}>
                <CloseIcon fontSize="small" />
            </IconButton>

                <Grid container spacing={2}>
                    <Grid item xs>

                        <Box sx={{
                            borderRadius: '5px',
                            width: 270, // Sabit genişlik değeri
                            height: 410, // Sabit yükseklik değeri
                            overflow: 'hidden', // borderRadius etkisini img üzerinde göstermek için
                            p: 1,
                            bgcolor: 'grey.200',
                        }}>
                            <Grid item>
                                <img
                                    src={getMapImageUrl(lat, lng)}
                                    alt="Street View"
                                    style={{ width: '270px', height: '270px', borderRadius: '15px' }} // Inline style kullanarak genişlik ve yükseklik atama
                                />
                            </Grid>
                            <Grid item>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'h6.fontSize', color: 'text.primary' }}>
                            {locationNamee}
                        </Typography>
                    </Grid>
                    <Grid item>
                       <Typography variant="body1">Latitude : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lat}</span></Typography>
                    </Grid>
                    <Grid item>
                       <Typography variant="body1">Longitude : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lng}</span></Typography>
                    </Grid>
                            <Grid item>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'grey',fontSize: '0.8rem' }}>
                                    <IconButton onClick={handleClick}>
                                        <FileDownloadIcon fontSize="small" />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={() => handleDownload('json')}>JSON olarak indir</MenuItem>
                                        <MenuItem onClick={() => handleDownload('csv')}>CSV olarak indir</MenuItem>
                                    </Menu>
                                    added at {formattedTime}
                                </Typography>
                            </Grid>
                    </Box>


                        <Box sx={{
                            borderRadius: '5px',
                            marginTop: 2,
                            width: 270,
                            height: 240,
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
                                            <TableCell align="right">Yearly Average</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.data}>
                                                <TableCell component="th" scope="row">
                                                    {row.data}
                                                </TableCell>
                                                <TableCell align="right">{row.yearlyAverage} kWh/m² </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>



                    </Grid>


                    <Grid item xs>
                        <Box sx={{
                            borderRadius: '5px',
                            width: 270, // Sabit genişlik değeri
                            height: 410, // Sabit yükseklik değeri
                            overflow: 'hidden', // borderRadius etkisini img üzerinde göstermek için
                            p: 1,
                            bgcolor: 'grey.200',
                        }}>
                    <Grid item>
                        <Box sx={{ maxHeight: "390px", maxWidth: "260px" }}> {/* Boyutları iki katına çıkarıldı */}
                            <canvas id="dniChart" width="400" height="410"></canvas> {/* Piksel cinsinden genişlik ve yükseklik ayarlandı */}
                        </Box>
                    </Grid>
                        </Box>

                        <Box sx={{
                            borderRadius: '5px',
                            width: 270, // Dış Box genişliği
                            height: 240, // Dış Box yüksekliği
                            marginTop: 2,
                            overflow: 'hidden',
                            p: 1,
                            bgcolor: 'grey.200',
                            display: 'flex', // İç Box'ları yan yana getirmek için
                            flexDirection: 'row', // Yatay olarak dizilim
                        }}>
                            <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {/* Sol taraftaki içerik */}
                                <FormControl sx={{ m: 1, width: '13ch' }} variant="outlined">
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Select"
                                        color="success"
                                        value={selectedCurrency}
                                        onChange={handleCurrencyChange}
                                        sx={{ mb: 2 }}
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <OutlinedInput
                                        id="outlined-adornment-weight"
                                        value={quantity}
                                        color="success"
                                        onChange={handleQuantityChange}
                                        endAdornment={<InputAdornment position="end">qty</InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight' }}
                                        sx={{ mb: 2 }}
                                    />

                                    <Button variant="outlined" onClick={calculate} color="success">Calculate</Button>
                                </FormControl>
                            </Box>
                            <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {/* "Yıllık Ortalama" Başlığı */}
                                <Typography variant="h6" sx={{ mb: 2 }}>Annual averages</Typography>
                                {/* Yıllık Ortalama Değeri */}
                                <Typography variant="body1">{yearlyAverage} kWh</Typography>
                            </Box>
                        </Box>
                </Grid>
                </Grid>
        </Box>
    );
}

export default Location;
