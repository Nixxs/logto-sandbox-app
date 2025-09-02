// Protected.jsx
import { useLogto } from '@logto/react';
import { useEffect, useState } from 'react';

export default function Protected() {
  const { isAuthenticated, getAccessToken } = useLogto();
  const [token, setToken] = useState(null);
  const resource = import.meta.env.VITE_LOGTO_RESOURCE; // e.g. 'api://logto-sandbox-api'

  useEffect(() => {
    const run = async () => {
      try {
        // Make sure your LogtoProvider config includes this resource + scopes
        const t = await getAccessToken(resource);
        setToken(t || null);
      } catch (e) {
        console.error('Failed to fetch access token:', e);
        setToken(null);
      }
    };
    if (isAuthenticated) run();
  }, [isAuthenticated, getAccessToken, resource]);

  if (!isAuthenticated) return <div style={{ padding: 24 }}>Not authenticated.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Protected page</h2>
      <p>Access token for <code>{resource}</code>:</p>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {token ?? '(no token yet)'}
      </pre>
    </div>
  );
}
