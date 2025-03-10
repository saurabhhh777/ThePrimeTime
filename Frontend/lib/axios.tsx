import axios from 'axios';

declare global {
    interface ImportMetaEnv {
        VITE_BACKEND_URL: string;
    }
    interface ImportMeta {
        readonly env: ImportMetaEnv
    }
}

export const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
    headers: {
        'Content-Type': 'application/json'
    }
});
