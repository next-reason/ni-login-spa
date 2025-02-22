# Next Identity SPA Example

This repository contains a simple Single Page Application (SPA) example demonstrating authentication with Next Identity using the OIDC protocol.  It's designed to be a basic starting point and should be adapted to your specific needs.

## Features

*   Login with Next Identity
*   Retrieves and displays user profile information
*   Logout functionality
*   Uses separate configuration file for client ID, issuer URL, and redirect URI.
*   Basic styling.
*   Runs locally using `serve`.
*   Includes a `state` parameter for security.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://www.google.com/search?q=https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)  # Replace with your repo URL
    cd YOUR_REPO_NAME
    ```

2.  **Install `serve` globally (if you don't have it already):**

    ```bash
    npm install -g serve
    ```

## Configuration

1.  **Edit `config.js`:**  This file contains the essential configuration for your Next Identity integration.  **You MUST replace the placeholder values with your actual Next Identity credentials.**

    ```javascript
    const config = {
        clientId: 'YOUR_NEXT_IDENTITY_CLIENT_ID', // Replace with your client ID
        issuer: 'YOUR_NEXT_IDENTITY_ISSUER_URL', // Replace with your issuer URL (e.g., [https://your-next-identity-provider.com](https://your-next-identity-provider.com))
        redirectUri: window.location.origin + '/callback', // Important: Add a callback route. Make sure this is registered in your Next Identity console.
        scopes: ['openid', 'profile', 'email'], // Add the scopes you need
    };
    ```

    *   **`clientId`:** Your Next Identity application's client ID.
    *   **`issuer`:** The URL of your Next Identity provider's issuer.
    *   **`redirectUri`:** The URL where Next Identity will redirect the user after authentication. This *must* match a registered redirect URI in your Next Identity application settings.  The example uses `window.location.origin + '/callback'`, which assumes your app will be served from the root of a domain and that you'll handle a `/callback` route.  Adjust as needed for your setup.
    *   **`scopes`:**  The OIDC scopes you are requesting (e.g., `openid`, `profile`, `email`).

## Usage

1.  **Start the local server:**

    ```bash
    serve -s .
    ```

2.  **Open the application in your browser:**  `serve` will provide you with a URL (usually `http://localhost:5000`).

3.  **Log in:** Click the "Log In" button. You will be redirected to Next Identity to authenticate.

4.  **Authorize the application:** After successful authentication, you'll be redirected back to your application.

5.  **View profile:** If authentication is successful, the user's profile information will be displayed.

6.  **Log out:** Click the "Log Out" button to clear the session.

## Important Notes

*   **Security:** This example is for demonstration purposes.  In a production environment, you should implement more robust security measures, including validating the `state` parameter received from Next Identity during the callback and securely storing and managing access tokens.  Do not expose your client secret in the client-side code.
*   **Callback Route:** The `redirectUri` in `config.js` *must* be registered in your Next Identity application settings.  This example assumes a simple setup. If you are using a more complex routing setup in your SPA, you'll need to adjust the callback handling accordingly.
*   **Error Handling:** The current error handling is basic.  You should add more comprehensive error handling in a production application.
*   **Next Identity Setup:** You will need to create an application in your Next Identity console and obtain the necessary credentials (client ID, issuer URL) before running this example.

## Contributing

Contributions are welcome!  Please open an issue or submit a pull request.