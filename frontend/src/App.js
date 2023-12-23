import React, { useState , useCallback, useRef, useEffect} from 'react';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import { fetchSolarData } from './services/solarData';
import { getLocationName } from './services/getLocationName';
import Navbar from './components/navbar';
import Location from './services/location';
import CityLocation from './services/cityLocation';

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
    const [solarData, setSolarData] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [dniArray, setDniArray] = useState([]);
    const [dwnArray, setDwnArray] = useState([]);
    const [dıfArray, setDıfArray] = useState([]);
    const [showLocation, setShowLocation] = useState(false);



    const turkiyeSehirleri = [ //türkiyedeki tüm şehirleri tek tek çekmeliyiz
        { ad: "Adana", lat: 37.0310, lng: 35.3952, icon: 'sun_location.svg' },
        { ad: "Adıyaman", lat: 37.7407, lng: 38.2486, icon: 'sun_location.svg' },
        { ad: "Afyonkarahisar", lat: 38.6690, lng: 30.7337, icon: 'sun_location.svg' },
        { ad: "Ağrı", lat: 39.7217, lng: 43.0510, icon: 'sun_location.svg' },
        { ad: "Aksaray", lat: 38.2848, lng: 33.8497, icon: 'sun_location.svg' },
        { ad: "Amasya", lat: 40.6004, lng: 35.8353, icon: 'sun_location.svg' },
        { ad: "Ankara", lat: 39.9257, lng: 32.8595, icon: 'sun_location.svg' },
        { ad: "Antalya", lat: 36.8887, lng: 30.7079, icon: 'sun_location.svg' },
        { ad: "Ardahan", lat: 41.1082, lng: 42.6785, icon: 'sun_location.svg' },
        { ad: "Artvin", lat: 41.1784, lng: 41.8162, icon: 'sun_location.svg' },
        { ad: "Aydın", lat: 37.8450, lng: 27.8450, icon: 'sun_location.svg' },
        { ad: "Balıkesir", lat: 39.6492, lng: 27.8861, icon: 'sun_location.svg' },
        { ad: "Batman", lat: 37.8812, lng: 41.1351, icon: 'sun_location.svg' },
        { ad: "Bayburt", lat: 40.2552, lng: 40.2249, icon: 'sun_location.svg' },
        { ad: "Bilecik", lat: 40.1431, lng: 29.9792, icon: 'sun_location.svg' },
        { ad: "Bingöl", lat: 38.8853, lng: 40.4983, icon: 'sun_location.svg' },
        { ad: "Bitlis", lat: 38.4012, lng: 42.1081, icon: 'sun_location.svg' },
        { ad: "Bolu", lat: 40.7395, lng: 31.6111, icon: 'sun_location.svg' },
        { ad: "Burdur", lat: 37.7203, lng: 30.2908, icon: 'sun_location.svg' },
        { ad: "Bursa", lat: 40.1826, lng: 29.0669, icon: 'sun_location.svg' },
        { ad: "Aydın", lat: 37.8450, lng: 27.8450, icon: 'sun_location.svg' },
        { ad: "Balıkesir", lat: 39.6492, lng: 27.8861, icon: 'sun_location.svg' },
        { ad: "Bartın", lat: 41.6344, lng: 32.3375, icon: 'sun_location.svg' },
        { ad: "Batman", lat: 37.8812, lng: 41.1351, icon: 'sun_location.svg' },
        { ad: "Bayburt", lat: 40.2552, lng: 40.2249, icon: 'sun_location.svg' },
        { ad: "Bilecik", lat: 40.1431, lng: 29.9792, icon: 'sun_location.svg' },
        { ad: "Bingöl", lat: 38.8853, lng: 40.4983, icon: 'sun_location.svg' },
        { ad: "Bitlis", lat: 38.4012, lng: 42.1081, icon: 'sun_location.svg' },
        { ad: "Bolu", lat: 40.7395, lng: 31.6111, icon: 'sun_location.svg' },
        { ad: "Burdur", lat: 37.7203, lng: 30.2908, icon: 'sun_location.svg' },
        { ad: "Bursa", lat: 40.1826, lng: 29.0669, icon: 'sun_location.svg' },
        // Diğer şehirler...
    ];


    useEffect(() => {
        if (isLoaded) {
            setMarkers(current => [
                ...current,
                ...turkiyeSehirleri.map(sehir => ({
                    lat: sehir.lat,
                    lng: sehir.lng,
                    time: new Date(), // Her şehir için farklı bir zaman damgası oluşturmalıyız !!!DİKKAT!!!
                    icon: sehir.icon,
                    ad: sehir.ad // Şehir adı, isteğe bağlı
                }))
            ]);
        }
    }, [isLoaded]);



    useEffect(() => {
        if (selected) {
            getLocationName(selected.lat, selected.lng)
                .then(name => {
                    setLocationName(name); // Çekilen konum ismini state'e kaydet
                })
                .catch(error => console.error('Error fetching location name:', error));
        }
    }, [selected]);

    useEffect(() => {
        if (selected) {
            fetchSolarData(selected.lat, selected.lng)
                .then(data => {
                    setSolarData(data);
                    if (data && data.dni) {
                        const dniValues = Object.values(data.dni);
                        const dwnValues = Object.values(data.swdwn);
                        const dıfValues = Object.values(data.dıf);
                        setDniArray(dniValues);
                        setDwnArray(dwnValues);
                        setDıfArray(dıfValues);
                    }
                })
                .catch(error => console.error('Error fetching solar data:', error));
        }
    }, [selected]);


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
                onClick={() => {
                    setSelected(marker);
                    setShowLocation(true);
                }} />)}
                {selected && selected.icon === 'sun_location.svg'
                    ? (
                        <CityLocation
                            ad={selected.ad}
                            show={showLocation}
                            setShow={setShowLocation}
                            lat={selected.lat}
                            lng={selected.lng}
                        />
                    ) : selected ? (
                        // Eğer selected var ama ikon 'dark_location.svg' değilse burada başka bir bileşen veya içerik gösterebilirsiniz.
                        <Location
                            show={showLocation}
                            setShow={setShowLocation}
                            locationname={locationName}
                            lat={selected.lat}
                            lng={selected.lng}
                            solarData={solarData ? JSON.stringify(solarData) : 'Loading...'}
                            time={selected.time}
                            dniArray={dniArray}
                            dwnArray={dwnArray}
                            dıfArray={dıfArray}
                        />
                    ) : null}
            </GoogleMap>
        </div>
    );
}

