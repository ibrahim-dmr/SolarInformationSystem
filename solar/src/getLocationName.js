export const getLocationName = async (lat, lng) => {
    const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const apiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${OPENWEATHER_API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.length > 0) {
            const location = data[0];
            // Daha detaylı lokasyon ismi oluştur
            const locationName = [location.name, location.state, location.country].filter(Boolean).join(', ');
            return locationName;
        } else {
            return 'Unknown location';
        }
    } catch (error) {
        console.error('Error fetching location name:', error);
    }
};
