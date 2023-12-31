// solarData.js
export const fetchSolarData = async (lat, lng) => {
    const token = process.env.REACT_APP_NASAPOWER_API_TOKEN;
    // 'ALLSKY_KT' parametresi eklendi
    const parameters = 'ALLSKY_SFC_SW_DNI,ALLSKY_SFC_SW_DWN,ALLSKY_SFC_SW_DIFF,ALLSKY_SRF_ALB,ALLSKY_KT';
    const apiUrl = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=${parameters}&community=RE&longitude=${lng}&latitude=${lat}&start=2022&end=2022&format=JSON&user=batuhan21&api_key=${token}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Çekilen verileri işleme kısmı
        return {
            dni: data.properties.parameter.ALLSKY_SFC_SW_DNI,
            swdwn: data.properties.parameter.ALLSKY_SFC_SW_DWN,
            diff: data.properties.parameter.ALLSKY_SFC_SW_DIFF,
            alb: data.properties.parameter.ALLSKY_SRF_ALB, // Yüzey albedosu verisi
            kt: data.properties.parameter.ALLSKY_KT  // ALLSKY_KT verisi eklendi
        };
    } catch (error) {
        console.error('NASA POWER API Error:', error);
    }
};
