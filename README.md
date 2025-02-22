# Next Identity SPA SDK

## Overview
The Next Identity SPA SDK provides an easy way to integrate OpenID Connect (OIDC)-compliant authentication into your Single Page Applications (SPA). It supports login, logout, and fetching user information.

## Installation

### 1. Include the SDK via CDN
Add the following script tag to your application:

```html
<script src="https://your-cdn-url.com/next-identity-client.js"></script>
```

### 2. Configure the SDK
Create a configuration object to specify your client ID and issuer:

```html
<script>
  const NEXT_IDENTITY_CONFIG = {
    clientId: "your-client-id",
    issuer: "your-next-identity-issuer",
    redirectUri: window.location.origin,
  };
</script>
```

### 3. Initialize the SDK

```html
<script>
  const client = new NextIdentityClient(NEXT_IDENTITY_CONFIG);
</script>
```

## Usage

### Login
To trigger the login flow, call the `login()` method:

```html
<button id="loginButton">Login with Next Identity</button>

<script>
  document.getElementById('loginButton').addEventListener('click', () => client.login());
</script>
```

### Handle Redirect Callback
After a successful login, Next Identity redirects users back to your application. You need to handle this:

```html
<script>
  document.addEventListener("DOMContentLoaded", async function() {
    if (window.location.search.includes("code=")) {
      try {
        await client.handleRedirectCallback();
        console.log("User authenticated successfully");
      } catch (error) {
        console.error("Error handling authentication redirect:", error);
      }
    }
  });
</script>
```

### Fetch User Info
Once authenticated, retrieve the user's information:

```html
<button id="getUserButton">Get User Info</button>
<pre id="userInfo"></pre>

<script>
  document.getElementById('getUserButton').addEventListener('click', async () => {
    try {
      const userInfo = await client.getUserInfo();
      document.getElementById('userInfo').textContent = JSON.stringify(userInfo, null, 2);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  });
</script>
```

### Logout
To log the user out:

```html
<button id="logoutButton">Logout</button>

<script>
  document.getElementById('logoutButton').addEventListener('click', () => client.logout());
</script>
```

## Example Full Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next Identity SPA</title>
    <script src="https://your-cdn-url.com/next-identity-client.js"></script>
</head>
<body>
    <button id="loginButton">Login with Next Identity</button>
    <button id="logoutButton" style="display: none;">Logout</button>
    <button id="getUserButton" style="display: none;">Get User Info</button>
    <pre id="userInfo"></pre>
    
    <script>
      const client = new NextIdentityClient(NEXT_IDENTITY_CONFIG);

      document.getElementById('loginButton').addEventListener('click', () => client.login());
      document.getElementById('logoutButton').addEventListener('click', () => {
        client.logout();
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('getUserButton').style.display = 'none';
      });

      document.getElementById('getUserButton').addEventListener('click', async () => {
        try {
          const userInfo = await client.getUserInfo();
          document.getElementById('userInfo').textContent = JSON.stringify(userInfo, null, 2);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      });

      document.addEventListener("DOMContentLoaded", async function() {
        if (window.location.search.includes("code=")) {
          try {
            await client.handleRedirectCallback();
            document.getElementById('logoutButton').style.display = 'inline-block';
            document.getElementById('getUserButton').style.display = 'inline-block';
          } catch (error) {
            console.error("Error handling redirect:", error);
          }
        }
      });
    </script>
</body>
</html>
```

## Conclusion
The Next Identity SPA SDK provides an easy way to integrate authentication into SPAs using OpenID Connect. Simply include the SDK, configure it, and use the provided methods to authenticate users, retrieve user information, and log out.

For more details, visit [Next Identity Documentation](https://www.nextreason.com/products/next-identity).

