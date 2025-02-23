# Getting Started with Next Identity Login

This guide walks you through setting up a simple login using Next Identity. You will clone a pre-built project, configure your details, and run it locally with HTTPS.

## 1. Clone the Project
Clone the sample Next Identity Single Page Application (SPA) project:
```sh
git clone https://github.com/next-reason/ni-login-spa.git
cd ni-login-spa
```

## 2. Configure Your Identity Settings
Before running the application, update the configuration file (`config.js`) with your OpenID Connect provider details:
```javascript
export const config = {
  authority: "https://your-identity-provider.com",
  client_id: "your-client-id",
  redirect_uri: "http://localhost:3000/callback",
  post_logout_redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid profile email",
};
```

## 3. Modify the OpenID Connect SDK (Optional)
By default, the project uses the OpenID Connect SDK from the CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/next-reason/ni-js-sdk@latest/next-identity-client.js"></script>
```

If you need to customize the SDK, clone the repository and use your local version:
```sh
git clone https://github.com/next-reason/ni-js-sdk.git
```
Follow the README instructions in that repository to build and link it into your project.

## 4. Install Dependencies
Inside the `ni-login-spa` directory, install dependencies:
```sh
npm install
```

## 5. Run the Application Locally
To start the development server:
```sh
npm run dev
```
This will start the application at `http://localhost:3000/`.

## 6. Enable HTTPS Locally with mkcert (Optional)
To use HTTPS on localhost, install `mkcert`:

### Install mkcert
#### macOS:
```sh
brew install mkcert
brew install nss # For Firefox support
```

#### Windows (with Chocolatey):
```sh
choco install mkcert
```

#### Linux:
Follow installation steps at [mkcert GitHub](https://github.com/FiloSottile/mkcert).

### Generate Local Certificates
Run the following inside the project directory:
```sh
mkcert -install
mkcert localhost
```
This creates `localhost.pem` and `localhost-key.pem`.

### Configure HTTPS in Vite
Modify `vite.config.js` to enable HTTPS:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
});
```
Restart the server:
```sh
npm run dev
```
Now your app will be accessible via `https://localhost:3000/`.

---
Your Next Identity login should now be fully functional and running securely over HTTPS!

