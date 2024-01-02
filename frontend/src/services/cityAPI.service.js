import { getCookie } from "../common/getCookie.common";

export const CityAPIService = async (url, clickedCity) => {
    if (getCookie() != null) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'x-access-token': getCookie(),
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    city: clickedCity
                }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data['response']) {
                    console.log(JSON.parse(data["message"]));
                    return data['message'];
                } else {
                    throw new Error("City error: " + data["message"]);
                }
            } else {
                throw new Error(`${response.status} ${response.statusText} ${response.url}`);
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    } else {
        window.alert("Authentication Token Eksik!\n\nLogin olduktan sonra tekrar deneyiniz.");
        return false;
    }
}