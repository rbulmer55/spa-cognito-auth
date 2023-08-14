import axios from 'axios'
import pkceChallenge from 'pkce-challenge'

const clientId = import.meta.env.VITE_APP_COGNITO_CLIENT_ID
const appDomain = import.meta.env.VITE_APP_COGNITO_APP_DOMAIN
const redirect = import.meta.env.VITE_APP_COGNITO_REDIRECT_URI
const redirectSignout = import.meta.env.VITE_APP_COGNITO_REDIRECT_URI_SIGNOUT

type PKCEResponse = {
  code_verifier: string
  code_challenge: string
}

export async function generatePKCETokens(): Promise<PKCEResponse> {
  return pkceChallenge()
}

export function getAuthorizationCode(pkceChallenge: string) {
  return `${appDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&state=1234&scope=email&code_challenge_method=S256&code_challenge=${pkceChallenge}`
}

export function getLogoutUrl() {
  return `${appDomain}/logout?client_id=${clientId}&logout_uri=${redirectSignout}`
}

export async function getAccesstoken(code: string, pkceVerifier: string) {
  const resp = await axios.post(
    `${appDomain}/oauth2/token`,
    {
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      code_verifier: pkceVerifier,
      redirect_uri: redirect
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  return resp
}
