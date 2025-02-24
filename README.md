# Getting Started with Next Identity Login

Quick start guide for getting authentication running in a Single Page Applications (SPA) using OIDC + PKCE using Next Identity. 

You will clone a pre-built project, configure your details, and run it locally with HTTPS. 

**Pre-requisites:** 
- Have a Next Identity client id and issuer URL by configuring a user journey in the admin console.
- Install mkcert (with Homebrew you can use ```brew install mkcert```)
- Install Node (with Homebrew you can use ```brew install node```)

## 1. Clone the Project

Clone the sample Next Identity Single Page Application (SPA) project:

```sh
git clone https://github.com/next-reason/ni-login-spa.git
cd ni-login-spa
```

## 2. Configure Your Identity Settings

Update the configuration file (`config.js`) in the project to match your OpenID Connect provider details:

```javascript
// config.js
const config = {
    clientId: 'your-client-id', // Replace with your client ID
    issuer: 'https://your-identity-provider.com', // Replace with your issuer URL 
    redirectUri: window.location.origin + '/callback', // Important: Add a callback route
    scopes: ['openid', 'profile', 'email'], // Add the scopes you need
};
```

## 3. Modify the OpenID Connect SDK (Optional)

By default, the project uses the OpenID Connect SDK from the CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/next-reason/ni-js-sdk/next-identity-client.js"></script>
```

If you need to customize the SDK, clone the repository and use your local version:

```sh
git clone https://github.com/next-reason/ni-js-sdk.git
```

Follow the README instructions in that repository to build and link it into your project.

## 4. Enable HTTPS Locally with mkcert

Next Identity requires HTTPS as a callback URL. To use HTTPS on localhost, install `mkcert`:

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

If you are using a more advanced dev server like Webpack Dev Server, you'll need to configure it to use the certificates. Here is an example webpack.config.js configuration:

```javascript
module.exports = \{\
    // ... other config\
    devServer: \{
    https: \{
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
    port: 3000,
  },
};
```

## 5. Start Your Local Server

```sh
npx serve -s . -l 3000 --ssl-cert localhost.pem --ssl-key localhost-key.pem
```

Now your app will be accessible via `https://localhost:3000/`.

***

Your Next Identity login should now be fully functional and running securely over HTTPS!
