
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


export const createApiKey = () => {
    let apikey = "";
    for(let i=0;i<70;i++){
        apikey += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return apikey;

}
