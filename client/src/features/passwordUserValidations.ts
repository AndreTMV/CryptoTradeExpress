import {toast} from 'react-hot-toast'
const passWordValid = ( password:string, username:string ) =>
{
    const passwordRegex = /^(?=.*[.-])(?=.*\d).{13,}$/;
    const isPasswordValid = passwordRegex.test( password );
    const sequenceRegex = /(123|abc)/i;
    const isSequenceFound = sequenceRegex.test(password);
    if ( !isPasswordValid )
    {
        toast.error( ` La contraseña debe tener al menos un carácter especial('.' y '-'), un carácter numérico y una longitud mínima de 13 caracteres.` );
        return false;

    }
    if ( isSequenceFound )
    {
        toast.error( `La contraseña no puede tener sucesiones como 123 o abc.` );
        return false;
    }
    if (password.includes(username)) {
        toast.error( "La contraseña no puede ser demasiado similar al nombre de usuario." );
        return false;
    }
    return true;
}

const userValid = ( username: string ) =>
{
    const usernameRegex = /^[a-zA-Z0-9.-]{5,}$/;
    const isUsernameValid = usernameRegex.test( username );
    if (!isUsernameValid) {
        toast.error( "El nombre de usuario debe tener una longitud mínima de 5 caracteres y solo puede contener letras, números, '.' y '-'" );
        return false;
    }
    return true;
}

const validations = {userValid, passWordValid}
export default validations;


