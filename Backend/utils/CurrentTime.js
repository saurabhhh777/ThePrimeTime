
export const getCurrentTime = ()=>{
    const date = new Date();
    const hours = date.getHours().toString().padEnd(2,'0');
    const minutes = date.getMinutes().toString().padEnd(2,'0');
    const day = date.getDay().toString().padEnd(2,'0');
    const month = date.getMonth().toString().padEnd(2,'0');
    const year = date.getFullYear().toString().padEnd(2,'0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
}