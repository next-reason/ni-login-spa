// app.js
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const profileInfo = document.getElementById('profile-info');
  const profileDetails = document.getElementById('profile-details');
  const logoutButton = document.getElementById('logout-button');

  const nextIdentity = {
    authorize: () => {
      const authUrl = new URL(`${config.issuer}/authorize`);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('client_id', config.clientId);
      authUrl.searchParams.set('redirect_uri', config.redirectUri);
      authUrl.searchParams.set('scope', config.scopes.join(' '));
      authUrl.searchParams.set('state', generateRandomString(32)); // Important for security
      window.location.href = authUrl.toString();
    },
    getToken: async (code) => {
        const tokenUrl = new URL(`${config.issuer}/token`);
        tokenUrl.searchParams.set('grant_type', 'authorization_code');
        tokenUrl.searchParams.set('code', code);
        tokenUrl.searchParams.set('redirect_uri', config.redirectUri);
        tokenUrl.searchParams.set('client_id', config.clientId);
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        return await response.json();
    },
    getUserInfo: async (accessToken) => {
      const userInfoUrl = `${config.issuer}/userinfo`;
      const response = await fetch(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await response.json();
    },
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('profile');
      profileInfo.style.display = 'none';
      loginButton.style.display = 'block';

    }
  };

  loginButton.addEventListener('click', () => {
      nextIdentity.authorize();
  });

  logoutButton.addEventListener('click', () => {
    nextIdentity.logout();
  });

  // Handle the callback
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    // Exchange code for token and get user info
    nextIdentity.getToken(code)
      .then(tokenResponse => {
        localStorage.setItem('access_token', tokenResponse.access_token);
        return nextIdentity.getUserInfo(tokenResponse.access_token)
      })
      .then(profile => {
        localStorage.setItem('profile', JSON.stringify(profile));
        displayProfile(profile);
      })
      .catch(error => console.error("Error during authentication:", error));

      // Clear the code from URL for security
      window.history.pushState({}, document.title, window.location.pathname);
  } else {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
          displayProfile(JSON.parse(storedProfile));
      }
  }


  function displayProfile(profile) {
      profileDetails.textContent = JSON.stringify(profile, null, 2);
      profileInfo.style.display = 'block';
      loginButton.style.display = 'none';
  }


  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

});