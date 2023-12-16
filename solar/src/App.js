import React, { useState , useCallback, useRef, useEffect} from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import {formatRelative} from "date-fns";
import { fetchSolarData } from './solarData';
import { getLocationName } from './getLocationName';
import Navbar from './navbar';
import Location from './location';
import CityLocation from './cityLocation';

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

    useEffect(() => {
        if (isLoaded) { // Harita yüklendiyse
            setMarkers(current => [
                ...current,
                {
                    lat: 36.884804, // Varsayılan konumun enlemi
                    lng: 30.704044, // Varsayılan konumun boylamı
                    time: new Date(), // Konumun eklenme zamanı
                    icon: 'yellow_location.svg',
                },
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
            {selected && selected.icon === 'yellow_location.svg'
                ? (
                    <CityLocation
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

