export const RegisterAPIService = async (url,id, pw, email) =>{
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
                password : pw,
                email : email,
                roles : ["user"]
            })
        });
        if(response.ok){
            const data = await response.json();
            if(data['response']){
                console.log(data);
                window.alert("Kayıt Başarılı!");
                return true;
            } else {
                throw new Error("Register error: " + data["message"])
            }
        } else {
            throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}