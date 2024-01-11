import React, { useState , useCallback, useRef, useEffect} from 'react';
import {
    GoogleMap,
    useLoadScript,
    Marker
} from "@react-google-maps/api";
import NavbarMiddleWare from './middleware/navbar.middleware';
import Navbar from './components/navbar';
import LogoutNavbar from './components/logoutNavbar';
import Location from './services/location';
import CityLocation from './services/cityLocation';
import { CityAPIService } from './services/cityAPI.service';
import { DistrictAPIService } from './services/districtAPI.sevice';
import TownLocation from './services/townLocation'


const libraries = ["places"];
const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
};
const center = {
    lat: 38.9637,
    lng: 35.2433
};
const options = {
    mapTypeId: "satellite", // Uydu görünümünü etkinleştirmek için bu satırı ekleyin
    disableDefaultUI: true, // harita üstündeki tüm kontrollerden kurtuluyoruz
    zoomControl: false,
}



export default function App() {

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [navbarMiddleware, setNavbarMiddleware] = useState(false);

    const [markers, setMarkers] = useState([]);
    const[selected,setSelected] = useState(null);
    const [showLocation, setShowLocation] = useState(false);
    const [cityData, setCityData] = useState(''); // Alınan veriyi saklamak için state
    const [townData, setTownData] = useState(''); // Alınan veriyi saklamak için state


    const turkiyeSehirleri = [ //türkiyedeki tüm şehirleri tek tek çekmeliyiz
        { ad: "Adana", lat: 37.01062, lng: 35.318509, icon: 'sun_location2.svg', time: new Date('2023-01-01') },
        { ad: "Adıyaman", lat: 37.74172, lng: 38.207144, icon: 'sun_location2.svg',time: new Date('2023-01-02') },
        { ad: "Afyonkarahisar", lat: 38.70082, lng: 30.681316, icon: 'sun_location2.svg',time: new Date('2023-01-03') },
        { ad: "Ağrı", lat: 39.60035, lng:43.493217, icon: 'sun_location2.svg', time: new Date('2023-01-04')  },
        { ad: "Aksaray", lat: 38.40939, lng: 33.836609, icon: 'sun_location2.svg', time: new Date('2023-01-05')  },
        { ad: "Amasya", lat: 40.65575, lng: 35.835835, icon: 'sun_location2.svg', time: new Date('2023-01-06')  },
        { ad: "Ankara", lat: 39.90310, lng: 32.854982, icon: 'sun_location2.svg', time: new Date('2023-01-07')  },
        { ad: "Antalya", lat: 36.89842, lng: 30.695374, icon: 'sun_location2.svg', time: new Date('2023-01-08')  },
        { ad: "Ardahan", lat: 41.10825, lng: 42.687273, icon: 'sun_location2.svg', time: new Date('2023-01-09')  },
        { ad: "Artvin", lat:41.18675, lng: 41.820556, icon: 'sun_location2.svg', time: new Date('2023-01-10')  },
        { ad: "Aydın", lat: 37.84880, lng: 27.848813, icon: 'sun_location2.svg', time: new Date('2023-01-11')  },
        { ad: "Balıkesir", lat: 39.65211, lng:27.892241, icon: 'sun_location2.svg', time: new Date('2023-01-12')  },
        { ad: "Bartın", lat: 41.57941, lng: 32.28437, icon: 'sun_location2.svg', time: new Date('2023-01-13')  },
        { ad: "Batman", lat: 37.88961, lng: 41.138533, icon: 'sun_location2.svg', time: new Date('2023-01-14')  },
        { ad: "Bayburt", lat: 40.22155, lng: 40.333895, icon: 'sun_location2.svg', time: new Date('2023-01-15')  },
        { ad: "Bilecik", lat: 40.15217, lng: 29.978591, icon: 'sun_location2.svg', time: new Date('2023-01-16')  },
        { ad: "Bingöl", lat: 38.88654, lng: 40.497686, icon: 'sun_location2.svg', time: new Date('2023-01-17')  },
        { ad: "Bitlis", lat: 38.39582, lng: 42.122436, icon: 'sun_location2.svg', time: new Date('2023-01-18')  },
        { ad: "Bolu", lat: 40.73590, lng: 31.60785, icon: 'sun_location2.svg', time: new Date('2023-01-19')  },
        { ad: "Burdur", lat: 37.71783, lng: 30.283484, icon: 'sun_location2.svg', time: new Date('2023-01-20')  },
        { ad: "Bursa", lat: 40.20328, lng: 29.064272, icon: 'sun_location2.svg', time: new Date('2023-01-21') },
        { ad: "Çanakkale", lat: 39.96979, lng: 26.826831, icon: 'sun_location2.svg', time: new Date('2023-01-22') },
        { ad: "Çankırı", lat: 40.60672, lng: 33.622517, icon: 'sun_location2.svg', time: new Date('2023-01-23') },
        { ad: "Çorum", lat: 40.51608, lng: 34.947621, icon: 'sun_location2.svg', time: new Date('2023-01-24') },
        { ad: "Denizli", lat: 37.77165, lng: 29.077861, icon: 'sun_location2.svg', time: new Date('2023-01-25') },
        { ad: "Diyarbakır", lat: 37.92498, lng: 40.230588, icon: 'sun_location2.svg', time: new Date('2023-01-26') },
        { ad: "Düzce", lat: 40.76742, lng: 31.239473, icon: 'sun_location2.svg', time: new Date('2023-01-27') },
        { ad: "Edirne", lat: 41.67079, lng: 26.568539, icon: 'sun_location2.svg', time: new Date('2023-01-28') },
        { ad: "Elazığ", lat: 38.68298, lng: 39.222313, icon: 'sun_location2.svg', time: new Date('2023-01-29') },
        { ad: "Erzincan", lat: 39.75733, lng: 39.490244, icon: 'sun_location2.svg', time: new Date('2023-01-30') },
        { ad: "Erzurum", lat: 39.91666, lng: 41.281637, icon: 'sun_location2.svg', time: new Date('2023-02-01') },
        { ad: "Eskişehir", lat: 39.79831, lng: 30.529698, icon: 'sun_location2.svg', time: new Date('2023-02-02') },
        { ad: "Gaziantep", lat: 37.08328, lng: 37.379835, icon: 'sun_location2.svg', time: new Date('2023-02-03') },
        { ad: "Giresun", lat: 40.91546, lng: 38.388949, icon: 'sun_location2.svg', time: new Date('2023-02-04') },
        { ad: "Gümüşhane", lat: 40.46618, lng: 39.482982, icon: 'sun_location2.svg', time: new Date('2023-02-05') },
        { ad: "Hakkari", lat: 37.57562, lng: 43.742753, icon: 'sun_location2.svg', time: new Date('2023-02-06') },
        { ad: "Hatay", lat: 36.23435, lng: 36.117135, icon: 'sun_location2.svg', time: new Date('2023-02-07') },
        { ad: "Iğdır", lat: 39.84459, lng: 44.043902, icon: 'sun_location2.svg', time: new Date('2023-02-08') },
        { ad: "Isparta", lat: 37.77089, lng: 30.531401, icon: 'sun_location2.svg', time: new Date('2023-02-09') },
        { ad: "İstanbul", lat: 41.10895, lng: 29.00326, icon: 'sun_location2.svg', time: new Date('2023-02-10') },
        { ad: "İzmir", lat: 38.43837, lng: 27.149762, icon: 'sun_location2.svg', time: new Date('2023-02-11') },
        { ad: "Kahramanmaraş", lat: 37.61402, lng: 36.942227, icon: 'sun_location2.svg', time: new Date('2023-02-12') },
        { ad: "Karabük", lat: 41.20171, lng: 32.597655, icon: 'sun_location2.svg', time: new Date('2023-02-13') },
        { ad: "Karaman", lat: 37.18154, lng: 33.214576, icon: 'sun_location2.svg', time: new Date('2023-02-14') },
        { ad: "Kars", lat: 40.61011, lng: 43.095749, icon: 'sun_location2.svg', time: new Date('2023-02-15') },
        { ad: "Kastamanu", lat: 41.38841, lng: 33.780375, icon: 'sun_location2.svg', time: new Date('2023-02-16') },
        { ad: "Kayseri", lat: 38.73639, lng: 35.488239, icon: 'sun_location2.svg', time: new Date('2023-02-17') },
        { ad: "Kırıkkale", lat: 39.85239, lng: 33.528162, icon: 'sun_location2.svg', time: new Date('2023-02-18') },
        { ad: "Kırıklareli", lat: 41.74516, lng: 27.225345, icon: 'sun_location2.svg', time: new Date('2023-02-19') },
        { ad: "Kırşehir", lat: 39.14169, lng: 34.170979, icon: 'sun_location2.svg', time: new Date('2023-02-20') },
        { ad: "Kilis", lat: 36.72238, lng: 37.119689, icon: 'sun_location2.svg', time: new Date('2023-02-21') },
        { ad: "Kocaeli", lat: 40.77266, lng: 29.929964, icon: 'sun_location2.svg', time: new Date('2023-02-22') },
        { ad: "Konya", lat: 37.87763, lng: 32.469118, icon: 'sun_location2.svg', time: new Date('2023-02-23') },
        { ad: "Kütahya", lat: 39.42121, lng: 29.931391, icon: 'sun_location2.svg', time: new Date('2023-02-24') },
        { ad: "Malatya", lat: 38.37005, lng: 38.301167, icon: 'sun_location2.svg', time: new Date('2023-02-25') },
        { ad: "Manisa", lat: 38.63099, lng: 27.439957, icon: 'sun_location2.svg', time: new Date('2023-02-26') },
        { ad: "Mardin", lat: 37.31196, lng: 40.743236, icon: 'sun_location2.svg', time: new Date('2023-02-27') },
        { ad: "Mersin", lat: 36.80217, lng: 34.619504, icon: 'sun_location2.svg', time: new Date('2023-03-01') },
        { ad: "Muğla", lat: 37.21623, lng: 28.362627, icon: 'sun_location2.svg', time: new Date('2023-03-02') },
        { ad: "Muş", lat: 38.75073, lng: 41.49764, icon: 'sun_location2.svg', time: new Date('2023-03-03') },
        { ad: "Nevşehir", lat: 38.62492, lng: 34.722297, icon: 'sun_location2.svg', time: new Date('2023-03-04') },
        { ad: "Niğde", lat: 37.97638, lng: 34.693942, icon: 'sun_location2.svg', time: new Date('2023-03-05') },
        { ad: "Ordu", lat: 41.00037, lng: 37.871382, icon: 'sun_location2.svg', time: new Date('2023-03-06') },
        { ad: "Osmaniye", lat: 37.05160, lng: 36.335047, icon: 'sun_location2.svg', time: new Date('2023-03-07') },
        { ad: "Rize", lat: 41.02296, lng: 40.51419, icon: 'sun_location2.svg', time: new Date('2023-03-08') },
        { ad: "Sakarya", lat: 40.76452, lng: 30.399544, icon: 'sun_location2.svg', time: new Date('2023-03-09') },
        { ad: "Samsun", lat: 41.27796, lng: 36.345391, icon: 'sun_location2.svg', time: new Date('2023-03-10') },
        { ad: "Siirt", lat: 37.94590, lng: 41.933203, icon: 'sun_location2.svg', time: new Date('2023-03-11') },
        { ad: "Sinop", lat: 42.02292, lng: 35.150834, icon: 'sun_location2.svg', time: new Date('2023-03-12') },
        { ad: "Sivas", lat: 39.74448, lng: 37.031152, icon: 'sun_location2.svg', time: new Date('2023-03-13') },
        { ad: "Şanlıurfa", lat: 37.17157, lng: 38.790784, icon: 'sun_location2.svg', time: new Date('2023-03-14') },
        { ad: "Şırnak", lat: 37.49789, lng: 42.351980, icon: 'sun_location2.svg', time: new Date('2023-03-15') },
        { ad: "Tekirdağ", lat: 40.99020, lng: 27.503552, icon: 'sun_location2.svg', time: new Date('2023-03-16') },
        { ad: "Tokat", lat: 40.30682, lng: 36.564379, icon: 'sun_location2.svg', time: new Date('2023-03-17') },
        { ad: "Trabzon", lat: 40.98438, lng: 39.720715, icon: 'sun_location2.svg', time: new Date('2023-03-18') },
        { ad: "Tunceli", lat: 39.11660, lng: 39.531819, icon: 'sun_location2.svg', time: new Date('2023-03-19') },
        { ad: "Uşak", lat: 38.68254, lng: 29.420989, icon: 'sun_location2.svg', time: new Date('2023-03-20') },
        { ad: "Van", lat: 38.49999, lng: 43.394243, icon: 'sun_location2.svg', time: new Date('2023-03-21') },
        { ad: "Yalova", lat: 40.62068, lng: 29.220324, icon: 'sun_location2.svg', time: new Date('2023-03-22') },
        { ad: "Yozgat", lat: 39.82059, lng: 34.812213, icon: 'sun_location2.svg', time: new Date('2023-03-23') },
        { ad: "Zonguldak", lat: 41.43115, lng: 31.779057, icon: 'sun_location2.svg', time: new Date('2023-03-24') },

        // Diğer şehirler...
    ];

    const turkiyeİlceleri = [
        { ad: "Ağın",sehir: 'Elazığ', lat: 38.9413, lng: 38.7182, icon: 'red_location.svg', time: new Date('2023-05-01') },
        { ad: "Alacakaya",sehir: 'Elazığ', lat: 38.4919, lng: 39.9997, icon: 'red_location.svg',time: new Date('2023-05-02') },
        { ad: "Arıcak",sehir: 'Elazığ', lat: 38.5542, lng: 40.1386, icon: 'red_location.svg',time: new Date('2023-05-03') },
        { ad: "Baskil",sehir: 'Elazığ', lat: 38.5725, lng: 38.8352, icon: 'red_location.svg', time: new Date('2023-05-04') },
        { ad: "Karakoçan",sehir: 'Elazığ', lat: 38.9425, lng: 40.0428, icon: 'red_location.svg', time: new Date('2023-05-05') },
        { ad: "Keban",sehir: 'Elazığ', lat: 38.7933, lng: 38.7492, icon: 'red_location.svg', time: new Date('2023-05-06') },
        { ad: "Kovancılar",sehir: 'Elazığ', lat: 38.7017, lng: 39.8492, icon: 'red_location.svg', time: new Date('2023-05-07') },
        { ad: "Maden",sehir: 'Elazığ', lat: 38.3924, lng: 39.6757, icon: 'red_location.svg', time: new Date('2023-05-08') },
        { ad: "Palu",sehir: 'Elazığ', lat: 38.6907, lng: 39.926, icon: 'red_location.svg', time: new Date('2023-05-09') },
        { ad: "Sivrice",sehir: 'Elazığ', lat: 38.4507, lng: 39.3101, icon: 'red_location.svg', time: new Date('2023-05-10') },
        { ad: "Seyhan",sehir: 'Adana', lat: 36.9838, lng: 35.298, icon: 'red_location.svg', time: new Date('2023-05-11') },
        { ad: "Besni",sehir: 'Adıyaman', lat: 37.6853, lng: 37.825, icon: 'red_location.svg', time: new Date('2023-05-12') },
        { ad: "Emirdağ",sehir: 'Afyonkarahisar', lat: 39.0098, lng: 31.1463, icon: 'red_location.svg', time: new Date('2023-05-13') },
        { ad: "Doğubayazıd",sehir: 'Ağrı', lat: 39.5396, lng: 44.018, icon: 'red_location.svg', time: new Date('2023-05-14') },
        { ad: "Eskil",sehir: 'Aksaray', lat: 38.3086, lng: 33.3592, icon: 'red_location.svg', time: new Date('2023-05-15') },
        { ad: "Taşova",sehir: 'Amasya', lat: 40.7581, lng: 36.3442, icon: 'red_location.svg', time: new Date('2023-05-16') },
        { ad: "Sincan",sehir: 'Ankara', lat: 39.9986, lng: 32.5814, icon: 'red_location.svg', time: new Date('2023-05-17') },
        { ad: "Serik",sehir: 'Antalya', lat: 36.9517, lng: 31.1189, icon: 'red_location.svg', time: new Date('2023-05-18') },
        { ad: "Damal",sehir: 'Ardahan', lat: 41.3394, lng: 42.8558, icon: 'red_location.svg', time: new Date('2023-05-19') },
        { ad: "Hopa",sehir: 'Artvin', lat: 41.4065, lng: 41.433, icon: 'red_location.svg', time: new Date('2023-05-20') },
        { ad: "Söke",sehir: 'Aydın', lat: 37.7049, lng: 27.3827, icon: 'red_location.svg', time: new Date('2023-05-21') },
        { ad: "Ayvalık",sehir: 'Balıkesir', lat: 39.3113, lng: 26.6861, icon: 'red_location.svg', time: new Date('2023-05-23') },
        { ad: "Ulus",sehir: 'Bartın', lat: 39.3113, lng: 26.6861, icon: 'red_location.svg', time: new Date('2023-05-24') },
        { ad: "Kozluk",sehir: 'Batman', lat: 38.1647, lng: 41.4869, icon: 'red_location.svg', time: new Date('2023-05-25') },
        { ad: "Demirözü",sehir: 'Bayburt', lat: 40.1639, lng: 39.8858, icon: 'red_location.svg', time: new Date('2023-05-26') },
        { ad: "Söğüt",sehir: 'Bilecik', lat: 40.0205, lng: 30.185, icon: 'red_location.svg', time: new Date('2023-05-27') },
        { ad: "Genç",sehir: 'Bingöl', lat: 38.7616, lng: 40.5577, icon: 'red_location.svg', time: new Date('2023-05-28') },
        { ad: "Ahlat",sehir: 'Bitlis', lat: 38.7486, lng: 42.475, icon: 'red_location.svg', time: new Date('2023-06-01') },
        { ad: "Seben",sehir: 'Bolu', lat: 40.4088, lng: 31.573, icon: 'red_location.svg', time: new Date('2023-06-02') },
        { ad: "Kemer",sehir: 'Burdur', lat: 37.355, lng: 30.0722, icon: 'red_location.svg', time: new Date('2023-06-03') },
        { ad: "İznik",sehir: 'Bursa', lat: 40.4267, lng: 29.7302, icon: 'red_location.svg', time: new Date('2023-06-04') },
        { ad: "Çan",sehir: 'Çanakkale', lat: 40.0161, lng: 27.0564, icon: 'red_location.svg', time: new Date('2023-06-05') },
        { ad: "Ilgaz",sehir: 'Çankırı', lat: 40.9156, lng: 33.6258, icon: 'red_location.svg', time: new Date('2023-06-06') },
        { ad: "Laçin",sehir: 'Çorum', lat: 40.7747, lng: 34.8738, icon: 'red_location.svg', time: new Date('2023-06-07') },
        { ad: "Çal",sehir: 'Denizli', lat: 38.0894, lng: 29.3953, icon: 'red_location.svg', time: new Date('2023-06-08') },
        { ad: "Eğil",sehir: 'Diyarbakır', lat: 38.2506, lng: 40.0756, icon: 'red_location.svg', time: new Date('2023-06-09') },
        { ad: "Gölkaya",sehir: 'Düzce', lat: 40.7817, lng: 31.0186, icon: 'red_location.svg', time: new Date('2023-06-10') },
        { ad: "Keşan",sehir: 'Edirne', lat: 40.8378, lng: 26.6278, icon: 'red_location.svg', time: new Date('2023-06-11') },
        { ad: "İliç",sehir: 'Erzincan', lat: 39.4611, lng: 38.5633, icon: 'red_location.svg', time: new Date('2023-06-12') },
        { ad: "Çat",sehir: 'Erzurum', lat: 39.6058, lng: 40.975, icon: 'red_location.svg', time: new Date('2023-06-13') },
        { ad: "Han",sehir: 'Eskişehir', lat: 39.1553, lng: 30.8628, icon: 'red_location.svg', time: new Date('2023-06-14') },
        { ad: "Nizip",sehir: 'Gaziantep', lat: 37.0122, lng: 37.8628, icon: 'red_location.svg', time: new Date('2023-06-15') },
        { ad: "Dereli",sehir: 'Giresun', lat: 40.7378, lng: 38.4495, icon: 'red_location.svg', time: new Date('2023-06-16') },
        { ad: "Köse",sehir: 'Gümüşhane', lat: 40.2217, lng: 39.6578, icon: 'red_location.svg', time: new Date('2023-06-17') },
        { ad: "Şemdinli",sehir: 'Hakkari', lat: 37.2951, lng: 44.5819, icon: 'red_location.svg', time: new Date('2023-06-18') },
        { ad: "Belen",sehir: 'Hatay', lat: 36.4889, lng: 36.2172, icon: 'red_location.svg', time: new Date('2023-06-19') },
        { ad: "Aralık",sehir: 'Iğdır', lat: 39.8683, lng: 44.5117, icon: 'red_location.svg', time: new Date('2023-06-20') },
        { ad: "Eğirdir",sehir: 'Isparta', lat: 37.8377, lng: 30.872, icon: 'red_location.svg', time: new Date('2023-06-21') },
        { ad: "Fatih",sehir: 'İstanbul', lat: 41.0155, lng: 28.9601, icon: 'red_location.svg', time: new Date('2023-06-22') },
        { ad: "Buca",sehir: 'İzmir', lat: 38.375, lng: 27.1953, icon: 'red_location.svg', time: new Date('2023-06-23') },
        { ad: "Afşin",sehir: 'Kahramanmaraş', lat: 38.2405, lng: 36.919, icon: 'red_location.svg', time: new Date('2023-06-24') },
        { ad: "Ovacık",sehir: 'Karabük', lat: 41.0778, lng: 32.91, icon: 'red_location.svg', time: new Date('2023-06-25') },
        { ad: "Ermenek",sehir: 'Karaman', lat: 36.6336, lng: 32.9075, icon: 'red_location.svg', time: new Date('2023-06-26') },
        { ad: "Digor",sehir: 'Kars', lat: 40.3717, lng: 43.4311, icon: 'red_location.svg', time: new Date('2023-06-27') },
        { ad: "Araç",sehir: 'Kastamonu', lat: 41.2467, lng: 33.3306, icon: 'red_location.svg', time: new Date('2023-06-28') },
        { ad: "Develi",sehir: 'Kayseri', lat: 38.3744, lng: 35.4797, icon: 'red_location.svg', time: new Date('2023-06-29') },
        { ad: "Delice",sehir: 'Kırıkkale', lat: 39.9406, lng: 34.0328, icon: 'red_location.svg', time: new Date('2023-07-01') },
        { ad: "Kaman",sehir: 'Kırşehir', lat: 39.3652, lng: 33.7064, icon: 'red_location.svg', time: new Date('2023-07-02') },
        { ad: "Musabeyli",sehir: 'Kilis', lat: 36.885, lng: 36.9203, icon: 'red_location.svg', time: new Date('2023-07-03') },
        { ad: "Gebze",sehir: 'Kocaeli', lat: 40.823, lng: 29.4342, icon: 'red_location.svg', time: new Date('2023-07-04') },
        { ad: "Ilgın",sehir: 'Konya', lat: 38.763, lng: 31.894, icon: 'red_location.svg', time: new Date('2023-07-05') },
        { ad: "Emet",sehir: 'Kütahya', lat: 39.3391, lng: 29.2713, icon: 'red_location.svg', time: new Date('2023-07-06') },
        { ad: "Kale",sehir: 'Malatya', lat: 38.4073, lng: 38.7507, icon: 'red_location.svg', time: new Date('2023-07-07') },
        { ad: "Kula",sehir: 'Manisa', lat: 38.5272, lng: 28.6368, icon: 'red_location.svg', time: new Date('2023-07-08') },
        { ad: "Derik",sehir: 'Mardin', lat: 37.3464, lng: 40.2573, icon: 'red_location.svg', time: new Date('2023-07-09') },
        { ad: "Mut",sehir: 'Mersin', lat: 36.6514, lng: 33.4339, icon: 'red_location.svg', time: new Date('2023-07-10') },
        { ad: "Milas",sehir: 'Muğla', lat: 37.3027, lng: 27.7804, icon: 'red_location.svg', time: new Date('2023-07-11') },
        { ad: "Varto",sehir: 'Muş', lat: 39.1763, lng: 41.4455, icon: 'red_location.svg', time: new Date('2023-07-12') },
        { ad: "Kozaklı",sehir: 'Nevşehir', lat: 39.21, lng: 34.8511, icon: 'red_location.svg', time: new Date('2023-07-13') },
        { ad: "Bor",sehir: 'Niğde', lat: 37.9214, lng: 34.5528, icon: 'red_location.svg', time: new Date('2023-07-14') },
        { ad: "Fatsa",sehir: 'Ordu', lat: 41.0405, lng: 37.4878, icon: 'red_location.svg', time: new Date('2023-07-15') },
        { ad: "Kadirli",sehir: 'Osmaniye', lat: 37.3575, lng: 36.0907, icon: 'red_location.svg', time: new Date('2023-07-16') },
        { ad: "Fındıklı",sehir: 'Rize', lat: 41.2703, lng: 41.1556, icon: 'red_location.svg', time: new Date('2023-07-17') },
        { ad: "Geyve",sehir: 'Sakarya', lat: 40.5214, lng: 30.296, icon: 'red_location.svg', time: new Date('2023-07-18') },
        { ad: "Bafra",sehir: 'Samsun', lat: 41.5515, lng: 35.9247, icon: 'red_location.svg', time: new Date('2023-07-19') },
        { ad: "Baykan",sehir: 'Siirt', lat: 39.9727, lng: 41.7917, icon: 'red_location.svg', time: new Date('2023-07-20') },
        { ad: "Gerze",sehir: 'Sinop', lat: 41.8119, lng: 35.1736, icon: 'red_location.svg', time: new Date('2023-07-21') },
        { ad: "Ulaş",sehir: 'Sivas', lat: 39.4414, lng: 37.0276, icon: 'red_location.svg', time: new Date('2023-07-22') },
        { ad: "Harran",sehir: 'Şanlıurfa', lat: 36.8072, lng: 39.4872, icon: 'red_location.svg', time: new Date('2023-07-23') },
        { ad: "İdil",sehir: 'Şırnak', lat: 37.3389, lng: 41.8897, icon: 'red_location.svg', time: new Date('2023-07-24') },
        { ad: "Malkara",sehir: 'Tekirdağ', lat: 40.8873, lng: 26.908, icon: 'red_location.svg', time: new Date('2023-07-25') },
        { ad: "Niksar",sehir: 'Tokat', lat: 40.5978, lng: 36.9353, icon: 'red_location.svg', time: new Date('2023-07-26') },
        { ad: "Vakfıkebir",sehir: 'Trabzon', lat: 41.0478, lng: 39.2751, icon: 'red_location.svg', time: new Date('2023-07-27') },
        { ad: "Pertek",sehir: 'Tunceli', lat: 38.9342, lng: 39.1672, icon: 'red_location.svg', time: new Date('2023-07-28') },
        { ad: "Özalp",sehir: 'Van', lat: 38.6573, lng: 43.9767, icon: 'red_location.svg', time: new Date('2023-07-29') },
        { ad: "Armutlu",sehir: 'Yalova', lat: 40.5478, lng: 28.8408, icon: 'red_location.svg', time: new Date('2023-08-01') },
        { ad: "Sarıkaya",sehir: 'Yozgat', lat: 39.4864, lng: 35.3469, icon: 'red_location.svg', time: new Date('2023-08-02') },
        { ad: "Çaycuma",sehir: 'Zonguldak', lat: 41.5066, lng: 32.0903, icon: 'red_location.svg', time: new Date('2023-08-03') },
        // Diğer ilçeler...
    ];

    useEffect(() => {
        if (isLoaded && !navbarMiddleware) {
            setMarkers(current => [
                ...current,
                // Önce şehirleri ekleyin
                ...turkiyeSehirleri.map(sehir => ({
                    lat: sehir.lat,
                    lng: sehir.lng,
                    time: sehir.time,
                    icon: sehir.icon,
                    ad: sehir.ad // Şehir adı
                })),
            ]);
        }
    }, [isLoaded, navbarMiddleware]);

    const [showIlceler, setShowIlceler] = useState(false);

    const handleIlceleriGoster = () => {
        setShowIlceler(!showIlceler);

        if (!showIlceler) {
            // İlçeleri göster
            const ilcelerMarkers = turkiyeİlceleri.filter(ilce =>
                ilce.sehir === selected.ad
            ).map(ilce => ({
                lat: ilce.lat,
                lng: ilce.lng,
                ad: ilce.ad,
                icon: 'red_location.svg', // İlçeler için ikon
                time: ilce.time // Eğer ilce nesnesinde 'time' özelliği varsa
            }));

            setMarkers(currentMarkers => [...currentMarkers, ...ilcelerMarkers]);
        } else {
            // İlçeleri gizle
            setMarkers(currentMarkers =>
                currentMarkers.filter(marker =>
                    !turkiyeİlceleri.some(ilce => ilce.ad === marker.ad && ilce.sehir === selected.ad)
                )
            );
        }
    };



    useEffect(() => {
        if(isLoaded){
            setNavbarMiddleware(NavbarMiddleWare());
            console.log(navbarMiddleware);
        }
    }, [isLoaded]);

    useEffect(() => {
        // navbar otomatik güncelleme (umuyorum)
        // navbarMiddleware state'inde değişiklik olduğunda tetiklenecek işlemleri de ekleyebiliriz.
    }, [navbarMiddleware]);


    const onMapClick = useCallback((event) => {
        setMarkers(current => [...current, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date(),
        },
        ])
    }, []);

    const mapRef = useRef();

    const panTo = useCallback(({ lat, lng }) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(18);
        }
    }, []);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    },[]);

    if (loadError) return "Error loading Maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <div>
            {navbarMiddleware ? ( <Navbar panTo={panTo}/>  ) : ( <LogoutNavbar  panTo={panTo}/>)}
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={5.9} center={center} options={options}
                       onClick={onMapClick}
                       onLoad={onMapLoad}>
                {markers.map(marker => <Marker key={marker.time.toISOString()} position={{lat: marker.lat,lng: marker.lng }}
                                               icon={{
                                                   url: marker.icon ? marker.icon : 'dark_location.svg', // Özel ikon varsa kullan, yoksa varsayılanı kullan
                                                   scaledSize: new window.google.maps.Size(40, 40), // İkonun ölçeklendirilmiş boyutu
                                                   origin: new window.google.maps.Point(0,0),
                                                   anchor: new window.google.maps.Point(20,15),
                                               }}
                                               onClick={ async () => {
                                                   if (marker.icon === 'sun_location2.svg') {
                                                       const result = await CityAPIService("http://localhost:3001/api/query/city", marker.ad);
                                                       if (result !== false) {
                                                           setShowLocation(true);
                                                           console.log(showLocation);
                                                           setSelected(marker);
                                                           setCityData(result);
                                                       }
                                                   } else if (marker.icon === 'red_location.svg') {
                                                       const result = await DistrictAPIService("http://localhost:3001/api/query/district", marker.ad);
                                                       if (result !== false) {
                                                           setShowLocation(true);
                                                           console.log(showLocation);
                                                           setSelected(marker);
                                                           setTownData(result);
                                                       }
                                                   } else {
                                                       setShowLocation(true);
                                                       console.log(showLocation);
                                                       setSelected(marker);
                                                   }
                                               }} />)}
                {selected && selected.icon === 'sun_location2.svg'
                    ? (
                        <CityLocation
                            ad={selected.ad}
                            show={showLocation}
                            setShow={setShowLocation}
                            lat={selected.lat}
                            lng={selected.lng}
                            selected={selected}
                            apiData={cityData}
                            handleIlceleriGoster={handleIlceleriGoster}
                            showIlceler={showIlceler}
                        />
                    ) : selected && selected.icon === 'red_location.svg'
                        ? (
                            <TownLocation
                                // TownLocation için gerekli prop'lar
                                selected={selected}
                                show={showLocation}
                                setShow={setShowLocation}
                                lat={selected.lat}
                                lng={selected.lng}
                                ad={selected.ad}
                                sehir={selected.sehir}
                                apiData={townData}
                                // Diğer gerekli prop'lar
                            />
                        ) : selected
                            ? (
                                <Location
                                    selected={selected}
                                    show={showLocation}
                                    setShow={setShowLocation}
                                    lat={selected.lat}
                                    lng={selected.lng}
                                    time={selected.time}
                                />
                            ) : null
                }
            </GoogleMap>
        </div>
    );
}