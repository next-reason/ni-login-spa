// config.js
const config = {
    clientId: 'YOUR_NEXT_IDENTITY_CLIENT_ID', // Replace with your client ID
    issuer: 'YOUR_NEXT_IDENTITY_ISSUER_URL', // Replace with your issuer URL (e.g., [https://your-next-identity-provider.com](https://your-next-identity-provider.com))
    redirectUri: window.location.origin + '/callback', // Important: Add a callback route. Make sure this is registered in your Next Identity console.
    scopes: ['openid', 'profile', 'email'], // Add the scopes you need
};