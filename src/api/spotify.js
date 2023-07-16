import axios from 'axios'
import { Base64 } from 'js-base64';
// import querystring from 'querystring';

const CLIENT_ID = 'e4aceda33ec947178d738ec2e9b74288'
const CLIENT_SECRET = '1a44bda08b3a4eb6af426d686c34fe4d'
const REDIRECT_URL_AFTER_SIGNIN = 'https://smufy.netlify.app'
const basic = Base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`);   
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

export const SPOTIFY_AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize'
export const STATE = generateRandomString(16)

const SCOPES_DELIMITTER = '%20'
const SCOPES = [
    'user-top-read',
    'user-read-private',
    'user-read-playback-state',
    'user-read-recently-played',
    'user-read-currently-playing',
    'user-library-read',
    'playlist-read-private',
]
const SCOPES_URL_PARAM = SCOPES.join(SCOPES_DELIMITTER)

// export const LOGIN_URL = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_SIGNIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true&state=${STATE}`
export const LOGIN_URL = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_SIGNIN}&scope=${SCOPES_URL_PARAM}&response_type=code&show_dialog=true&state=${STATE}`

export default axios.create({
    baseURL: 'https://api.spotify.com/v1/'
})

function generateRandomString(num) {
    return Array(num)
        .fill()
        .map(() => ((Math.random() * 36) | 0).toString(36))
        .join('')
}

export const getParamsFromUrl = () => {
    return window.location.search
    .substring(1)
    .split('&')
        .reduce((accumulater, currentValue) => {
            const [key, value] = currentValue.split('=')
            accumulater[key] = value
            return accumulater
        }, {})
}

// export const getAccessToken = async () => {
    
//     const requestBody = querystring.stringify({
//         grant_type: 'refresh_token',
//         refresh_token
//     });

//     try {
//         const response = await fetch(TOKEN_ENDPOINT, {
//             method: 'POST',
//             headers: {
//                 Authorization: `Basic ${basic}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: requestBody
//         });

//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Failed to get Token.');
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };
    
export const getRequestToken = async (codeClient) => {
    
    try {
        const response = await axios.post(
            TOKEN_ENDPOINT,
            new URLSearchParams({
                code: codeClient,
                redirect_uri: REDIRECT_URL_AFTER_SIGNIN,
                grant_type: 'authorization_code',
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${basic}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        localStorage.setItem('client_refresh_token_spotify', response.data.refresh_token)
    } catch (error) {
        // console.error(error);
    } finally {
        window.location.reload();
    }
};

export const getRefreshToken = async (reftoken) => {

    try {
        const response = await axios.post(
            TOKEN_ENDPOINT,
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: reftoken,
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${basic}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        localStorage.setItem('client_token_spotify', response.data.access_token);
    } catch (error) {
        // console.error(error);
    }
};