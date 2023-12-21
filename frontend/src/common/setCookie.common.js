export const setCookie = (value) => {
    var date = new Date();
    date.setTime(date.getTime() + (24*60*60*1000));
    let expires = "; expires=" + date.toUTCString();
    document.cookie = "access_token=" + (value)  + expires + "; path=/";
}