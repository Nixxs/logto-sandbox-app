// Protected.jsx
import { useLogto } from '@logto/react';
import { useEffect, useState } from 'react';

export default function Protected() {
  const { isAuthenticated, getAccessToken, getIdTokenClaims /*, getUserInfo? */ } = useLogto();
  const [apiToken, setApiToken] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [claims, setClaims] = useState(null);
  const resource = import.meta.env.VITE_LOGTO_RESOURCE;

  useEffect(() => {
    const run = async () => {
      try {
        // 1) API token for your backend (aud = your API)
        const tApi = await getAccessToken(resource);
        setApiToken(tApi || null);

        // 2) User token (no resource) for /userinfo
        const tUser = await getAccessToken(); // <-- no arg
        setUserToken(tUser || null);

        // 3) (Optional) ID token claims (already has basic profile if configured)
        const c = await getIdTokenClaims();
        setClaims(c || null);
      } catch (e) {
        console.error('Failed to fetch tokens:', e);
        setApiToken(null);
        setUserToken(null);
      }
    };
    if (isAuthenticated) run();
  }, [isAuthenticated, getAccessToken, getIdTokenClaims, resource]);

  if (!isAuthenticated) return <div style={{ padding: 24 }}>Not authenticated.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Protected page</h2>

      <p><strong>API access token for</strong> <code>{resource}</code>:</p>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {apiToken ?? '(no token yet)'}
      </pre>

      <p><strong>User access token (for /userinfo)</strong>:</p>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {userToken ?? '(no token yet)'}
      </pre>

      <h3>ID token claims</h3>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(claims, null, 2)}
      </pre>
    </div>
  );
}
