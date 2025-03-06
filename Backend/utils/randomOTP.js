const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

export const OTPGenerator = (length)=>{
    let otp = "";
    for(let i = 0; i < length; i++){
        otp += alpha[Math.floor(Math.random() * alpha.length)];
    }
    return otp;
}
