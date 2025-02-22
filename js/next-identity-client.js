const NEXT_IDENTITY_CONFIG = {
  clientId: "next-identity-client-here",
  issuer: "next-identity-issuer-url-here",
  redirectUri: "redirect-uri-here",
};

class NextIdentityClient {
  constructor({ clientId, issuer, redirectUri, scopes = "openid profile email", storage = localStorage }) {
    this.clientId = clientId;
    this.issuer = issuer;
    this.redirectUri = redirectUri;
    this.scopes = scopes;
    this.storage = storage;
    this.authEndpoint = `${issuer}/authorize`;
    this.tokenEndpoint = `${issuer}/token`;
    this.userInfoEndpoint = `${issuer}/userinfo`;
  }

  async login() {
    const state = this._generateRandomString();
    const codeVerifier = this._generateRandomString();
    const hashed = await this._sha256(codeVerifier);
    const codeChallenge = this._base64UrlEncode(hashed);
    
    this.storage.setItem("next_identity_state", state);
    this.storage.setItem("next_identity_code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256"
    });
    window.location.href = `${this.authEndpoint}?${params.toString()}`;
  }

  async handleRedirectCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    
    if (!code || state !== this.storage.getItem("next_identity_state")) {
      throw new Error("Invalid state or missing authorization code");
    }

    this.storage.removeItem("next_identity_state");

    const codeVerifier = this.storage.getItem("next_identity_code_verifier");
    this.storage.removeItem("next_identity_code_verifier");
    
    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: this.clientId,
        code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
      })
    });

    const data = await response.json();
    if (data.access_token) {
      this.storage.setItem("next_identity_access_token", data.access_token);
      this.storage.setItem("next_identity_id_token", data.id_token);
    }
    return data;
  }

  async getUserInfo() {
    const accessToken = this.storage.getItem("next_identity_access_token");
    if (!accessToken) throw new Error("No access token available");

    const response = await fetch(this.userInfoEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return await response.json();
  }

  logout() {
    this.storage.removeItem("next_identity_access_token");
    this.storage.removeItem("next_identity_id_token");
    window.location.href = this.issuer + "/logout?post_logout_redirect_uri=" + encodeURIComponent(this.redirectUri);
  }

  _generateRandomString(length = 32) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  async _sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(hashBuffer);
  }

  _base64UrlEncode(arrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}

// Expose a simple way to integrate into Webflow or other SPAs
window.NextIdentityClient = NextIdentityClient;
window.NEXT_IDENTITY_CONFIG = NEXT_IDENTITY_CONFIG;

// Usage Example (Webflow or other SPA):
// Add this snippet in Webflow's Custom Code section:
// <script src="https://your-cdn-url.com/next-identity-client.js"></script>
// <script>
//   const client = new NextIdentityClient(NEXT_IDENTITY_CONFIG);
//   document.getElementById('loginButton').addEventListener('click', () => client.login());
//   document.getElementById('logoutButton').addEventListener('click', () => client.logout());
//   document.getElementById('getUserButton').addEventListener('click', async () => {
//     const userInfo = await client.getUserInfo();
//     console.log(userInfo);
//   });
// </script>