import { setCookie } from "../common/setCookie.common";

export const LoginService = async (url,id,pw) =>{
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username : id,
                password : pw
            })
        });
        if(response.ok){
            const data = await response.json();
            if(data['response']){
                console.log(data);
                setCookie(data["accessToken"]);
                return true;
            } else {
                throw new Error("Login error: " + data["message"])
            }
        } else {
            throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}