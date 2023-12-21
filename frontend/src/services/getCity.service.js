import { getCookie } from "../common/getCookie.common";

export const GetCityService = async (url,clickedCity) =>{
    await fetch(url, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'x-access-token' : getCookie(),
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            city : clickedCity
        }),
        }).then(response => {
            if(response.ok){
                return response.json()
            } else {
                throw new Error(`${response.status} ${response.statusText} ${response.url}`);
            }
        }).then(data => {
            if(data['response']){
                console.log(JSON.parse(data["message"]))
                return true;
            } else {
                throw new Error("City error: " + data["message"])
            }
        }).catch(error => {
            console.log(error);
        })
    return false;
}