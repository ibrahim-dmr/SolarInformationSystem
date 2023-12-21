import { setCookie } from "../common/setCookie.common";

export const LoginService = async (url,id,pw) =>{
    await fetch(url, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username : id,
            password : pw
        }),
        }).then(response => {
            if(response.ok){
                return response.json()
            } else {
                throw new Error(`${response.status} ${response.statusText} ${response.url}`);
            }
        }).then(data => {
            if(data['response']){
                console.log(data["accessToken"])
                setCookie(data["accessToken"]);
                return true;
            } else {
                throw new Error("Login error: " + data["message"])
            }
        }).catch(error => {
            console.log(error);
        })
    return false;
}