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
import Menu from '@mui/material/Menu';
import ChatIcon from '@mui/icons-material/Chat'; // Chat ikonu

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
    const [albArrayy, setAlbArrayy] = useState([]);
    const [ktArrayy, setKtArrayy] = useState([]);
    const [locationNamee, setLocationNamee] = useState('');

    useEffect(() => {
        if (selected) {
            fetchSolarData(selected.lat, selected.lng)
                .then(data => {
                    setSolarDataa(data);
                    if (data ) {
                        const dniValues = Object.values(data.dni);
                        const dwnValues = Object.values(data.swdwn);
                        const dıfValues = Object.values(data.diff);
                        const albValues = Object.values(data.alb);
                        const ktValues = Object.values(data.kt);
                        setDniArrayy(dniValues);
                        setDwnArrayy(dwnValues);
                        setDıfArrayy(dıfValues);
                        setAlbArrayy(albValues);
                        setKtArrayy(ktValues);
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
                            label: 'DNI Değeri',
                            data: Object.values(dniArrayy),
                            borderColor: 'rgba(255, 68, 68, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'DWN Değeri',
                            data: Object.values(dwnArrayy),
                            borderColor: 'rgba(51, 153, 255, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'DIF Değeri',
                            data: Object.values(dıfArrayy),
                            borderColor: 'rgba(0, 255, 153, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'ALB Değeri',
                            data: Object.values(albArrayy),
                            borderColor: 'rgba(153, 0, 255, 1)',
                            borderWidth: 2, // Kalın çizgi
                            fill: false,
                            tension: 0.4 // Kavisli çizgiler
                        },
                        {
                            label: 'KT Değeri',
                            data: Object.values(ktArrayy),
                            borderColor: 'rgba(255, 159, 0, 1)',
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
                                text: 'Ay',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Değer',
                            },
                        },
                    },
                    responsive: true, // Responsive tasarım
                    maintainAspectRatio: false // Oranı koruma
                },
            });
        }
    }, [dniArrayy, dwnArrayy, dıfArrayy, albArrayy, ktArrayy]);


    const handleClose = () => {
        setShow(false); // 'show' state'ini false yaparak Box'ı gizle
        handleCloseMenu();
    };

    const rows = [
        { data: 'DNI', yearlyAverage: dniArrayy[dniArrayy.length - 1] },
        { data: 'DWN', yearlyAverage: dwnArrayy[dwnArrayy.length - 1] },
        { data: 'DIF', yearlyAverage: dıfArrayy[dıfArrayy.length - 1] },
        { data: 'ALB', yearlyAverage: albArrayy[albArrayy.length - 1] },
        { data: 'KT', yearlyAverage: ktArrayy[ktArrayy.length - 1] },
        // Daha fazla satır eklenebilir...
    ];

    const currencies = [
        {
            value: 'sml',
            label: 'küçük',
        },
        {
            value: 'nrm',
            label: 'orta',
        },
        {
            value: 'big',
            label: 'büyük',
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
        nrm: 3.5,  // Normal panel boyutu m²
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
                    difData: dıfArrayy,
                    albData: albArrayy,
                };
                // JSON olarak indirme
                downloadJSON(jsonData, fileName);
                break;
            case 'csv':
                const csvData = convertArraysToCSV(dniArrayy, dwnArrayy, dıfArrayy, albArrayy);
                downloadCSV(csvData, fileName);
                break;
            default:
                console.error('Bilinmeyen format');
        }
        handleClose();
    };



    //Generative AI GOOGLE
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    // Access your API key as an environment variable (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_API_KEY);


    const [geminiResponse, setGeminiResponse] = useState(''); // Durum değişkeni

    async function run(lat, lng) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Coğrafi konum bilgilerini alan değer
        const locationDescription = `Enlem: ${lat}, Boylam: ${lng} .`;

        // sorulacak prompt
        const prompt = `${locationDescription} Bu değerlere göre konumun güneş enerjisi potansiyeli hakkında bir değerlendirmede bulun.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        setGeminiResponse(text); // API yanıtını durum değişkenine atama
    }


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
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 1)', // Kenarlık gölgesi
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
                        width: 270, // Sabit genişlik değeri
                        height: 410, // Sabit yükseklik değeri
                        overflow: 'hidden', // borderRadius etkisini img üzerinde göstermek için
                        p: 1,
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
                                    left: 0,
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
                                style={{ width: '100%', height: '100%', borderRadius: '15px' }} // genişlik ve yükseklik %100 olarak ayarlanıyor
                            />
                        </Grid>

                        <Grid item>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'h6.fontSize', color: 'text.primary' }}>
                                {locationNamee}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">Enlem : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lat}</span></Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">Boylam : <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{lng}</span></Typography>
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
                                eklendiği zaman {formattedTime}
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
                                                {/* Eğer veri ALB ise yüzde formatında göster, değilse kWh/m² kullan */}
                                                { (row.data === 'ALB' || row.data === 'KT') ? `${(row.yearlyAverage * 100).toFixed(2)} %` : `${row.yearlyAverage} kWh/m²` }
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
                        borderRadius: '5px',
                        width: 269, // Sabit genişlik değeri
                        height: 410, // Sabit yükseklik değeri
                        overflow: 'hidden', // borderRadius etkisini img üzerinde göstermek için
                        p: 1,
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
                    }}>
                        <Grid item>
                            <Box sx={{ maxHeight: "390px", maxWidth: "260px" }}> {/* Boyutları iki katına çıkarıldı */}
                                <canvas id="dniChart" width="400" height="410"></canvas> {/* Piksel cinsinden genişlik ve yükseklik ayarlandı */}
                            </Box>
                        </Grid>
                    </Box>

                    <Box sx={{
                        borderRadius: '5px',
                        width: 269, // Dış Box genişliği
                        height: 240, // Dış Box yüksekliği
                        marginTop: 2,
                        overflow: 'hidden',
                        p: 1,
                        bgcolor: 'background.paper', // Kırık beyaz için
                        border: 1, // 1 piksel kenarlık
                        borderColor: 'grey.200', // Gri kenarlık rengi
                        '&:hover': {
                            bgcolor: 'grey.50', // Hover durumunda daha koyu kırık beyaz
                        },
                        display: 'flex', // İç Box'ları yan yana getirmek için
                        flexDirection: 'row', // Yatay olarak dizilim
                    }}>
                        <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {/* Sol taraftaki içerik */}
                            <FormControl sx={{ m: 1, width: '13ch' }} variant="outlined">
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Seç"
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
                                    endAdornment={<InputAdornment position="end">adet</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{ 'aria-label': 'weight' }}
                                    sx={{ mb: 2 }}
                                />

                                <Button variant="outlined" onClick={calculate} color="success">Hesapla</Button>
                            </FormControl>
                        </Box>
                        <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {/* "Yıllık Ortalama" Başlığı */}
                            <Typography variant="h6" sx={{ mb: 2 }}>Günlük Ortalama</Typography>
                            {/* Yıllık Ortalama Değeri */}
                            <Typography variant="body1">{yearlyAverage} kWh</Typography>
                        </Box>
                    </Box>

                </Grid>
                <Box sx={{
                    borderRadius: '5px',
                    marginTop: 2,
                    width: 573, // Dış Box genişliği
                    height: 390,
                    marginLeft: 2,
                    p: 1,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'grey.200',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                        bgcolor: 'grey.50',
                    },
                    overflow: 'auto', // Kaydırma çubuğu için
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
                }}>
                    <Button variant="outlined" color="success" onClick={() => run(selected.lat, selected.lng)}>
                        Google Gemini değerlendirmesi
                    </Button>
                    <Typography sx={{
                        overflow: 'auto',
                        maxHeight: '360px',
                        marginTop: 2,
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
                    }}>
                        {geminiResponse}
                    </Typography>
                </Box>




                <Box sx={{
                    borderRadius: '5px',
                    width: 573, // Dış Box genişliği
                    marginTop: 2,
                    marginLeft: 2,
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
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Profesyonel bir değerlendirmeye mi ihtiyacınız var?
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Yarattığınız konumun detaylarını - yalnızca boylam ve enlem bilgilerini - girerek, geliştirdiğimiz LLM modelimiz tarafından derinlemesine analizinden faydalanın !
                    </Typography>
                    <Button
                        variant="outlined"
                        color="success"
                        href="https://partyrock.aws/u/batu/7AZyezrqV/Solar-Energy-Analyzer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Solar Energy Analyzer
                    </Button>
                </Box>

            </Grid>

        </Box>

    );
}

export default Location;