import React, { useState , useCallback, useRef, useEffect} from 'react';
import {
    GoogleMap,
    useLoadScript,
    Marker
} from "@react-google-maps/api";
import Navbar from './components/navbar';
import LogoutNavbar from './components/logoutNavbar';
import Location from './services/location';
import CityLocation from './services/cityLocation';
import { GetCityService } from './services/getCity.service';

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

    const [markers, setMarkers] = useState([]);
    const[selected,setSelected] = useState(null);
    const [showLocation, setShowLocation] = useState(false);
    const [cityData, setCityData] = useState(''); // Alınan veriyi saklamak için state


    const turkiyeSehirleri = [ //türkiyedeki tüm şehirleri tek tek çekmeliyiz
        { ad: "Adana", lat: 37.0310, lng: 35.3952, icon: 'sun_location2.svg', time: new Date('2023-01-01') },
        { ad: "Adıyaman", lat: 37.7407, lng: 38.2486, icon: 'sun_location2.svg',time: new Date('2023-01-02') },
        { ad: "Afyonkarahisar", lat: 38.6690, lng: 30.7337, icon: 'sun_location2.svg',time: new Date('2023-01-03') },
        { ad: "Ağrı", lat: 39.7217, lng: 43.0510, icon: 'sun_location2.svg', time: new Date('2023-01-04')  },
        { ad: "Aksaray", lat: 38.2848, lng: 33.8497, icon: 'sun_location2.svg', time: new Date('2023-01-05')  },
        { ad: "Amasya", lat: 40.6004, lng: 35.8353, icon: 'sun_location2.svg', time: new Date('2023-01-06')  },
        { ad: "Ankara", lat: 39.9257, lng: 32.8595, icon: 'sun_location2.svg', time: new Date('2023-01-07')  },
        { ad: "Antalya", lat: 36.8887, lng: 30.7079, icon: 'sun_location2.svg', time: new Date('2023-01-08')  },
        { ad: "Ardahan", lat: 41.1082, lng: 42.6785, icon: 'sun_location2.svg', time: new Date('2023-01-09')  },
        { ad: "Artvin", lat: 41.1784, lng: 41.8162, icon: 'sun_location2.svg', time: new Date('2023-01-10')  },
        { ad: "Aydın", lat: 37.8450, lng: 27.8450, icon: 'sun_location2.svg', time: new Date('2023-01-11')  },
        { ad: "Balıkesir", lat: 39.6492, lng: 27.8861, icon: 'sun_location2.svg', time: new Date('2023-01-12')  },
        { ad: "Batman", lat: 37.8812, lng: 41.1351, icon: 'sun_location2.svg', time: new Date('2023-01-13')  },
        { ad: "Bayburt", lat: 40.2552, lng: 40.2249, icon: 'sun_location2.svg', time: new Date('2023-01-14')  },
        { ad: "Bilecik", lat: 40.1431, lng: 29.9792, icon: 'sun_location2.svg', time: new Date('2023-01-15')  },
        { ad: "Bingöl", lat: 38.8853, lng: 40.4983, icon: 'sun_location2.svg', time: new Date('2023-01-16')  },
        { ad: "Bitlis", lat: 38.4012, lng: 42.1081, icon: 'sun_location2.svg', time: new Date('2023-01-17')  },
        { ad: "Bolu", lat: 40.7395, lng: 31.6111, icon: 'sun_location2.svg', time: new Date('2023-01-18')  },
        { ad: "Burdur", lat: 37.7203, lng: 30.2908, icon: 'sun_location2.svg', time: new Date('2023-01-19')  },
        { ad: "Bursa", lat: 40.1826, lng: 29.0669, icon: 'sun_location2.svg', time: new Date('2023-01-20') },
        // Diğer şehirler...
    ];

    useEffect(() => {
        if (isLoaded) {
            setMarkers(current => [
                ...current,
                ...turkiyeSehirleri.map(sehir => ({
                    lat: sehir.lat,
                    lng: sehir.lng,
                    time: sehir.time, // Her şehir için farklı bir zaman damgası oluşturmalıyız !!!DİKKAT!!!
                    icon: sehir.icon,
                    ad: sehir.ad // Şehir adı, isteğe bağlı
                })),
            ]);
        }
    }, [isLoaded]);



    const onMapClick = useCallback((event) => {
        setMarkers(current => [...current, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date(),
        },
        ])
    }, []);

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    },[]);

    if (loadError) return "Error loading Maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <div>
            <Navbar/>
            <CityLocation />
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={5.9} center={center} options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}>
                {markers.map(marker => <Marker key={marker.time.toISOString()} position={{lat: marker.lat,lng: marker.lng }}
                icon={{
                    url: marker.icon ? marker.icon : 'dark_location.svg', // Özel ikon varsa kullan, yoksa varsayılanı kullan
                    scaledSize: new window.google.maps.Size(40, 40), // İkonun ölçeklendirilmiş boyutu
                }}
                onClick={ async () => {
                    setSelected(marker);
                    setShowLocation(true);
                    if(marker.icon === 'sun_location2.svg'){
                        const result = await GetCityService("http://localhost:3001/api/query/city", marker.ad);
                        setCityData(result);
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
                        />
                    ) : selected ? (
                        // Eğer selected var ama ikon 'dark_location.svg' değilse burada başka bir bileşen veya içerik gösterebilirsiniz.
                        <Location
                            selected={selected}
                            show={showLocation}
                            setShow={setShowLocation}
                            lat={selected.lat}
                            lng={selected.lng}
                            time={selected.time}
                        />
                    ) : null}
            </GoogleMap>
        </div>
    );
}

