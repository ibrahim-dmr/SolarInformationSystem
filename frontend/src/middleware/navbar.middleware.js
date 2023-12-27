import { getCookie } from "../common/getCookie.common";

const NavbarMiddleWare = () => {
    if(getCookie() !== null){
        return false
    } else {
        return true    
    }
}

export default NavbarMiddleWare