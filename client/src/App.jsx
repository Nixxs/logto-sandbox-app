import { useLogto } from '@logto/react';
import { Link } from 'react-router-dom';

export default function App() {
  const { isAuthenticated, signIn, signOut } = useLogto();

  return (
    <div style={{ padding: 24 }}>
      <h1>Logto Sandbox (JS)</h1>
      {!isAuthenticated ? (
        <>
          <p>You are not signed in.</p>
          <button onClick={() => signIn(`${window.location.origin}/callback`)}>
            Sign in / Sign up
          </button>
        </>
      ) : (
        <>
          <p>Signed in 🎉</p>
          <button onClick={() => signOut(`${window.location.origin}/`)}>
            Sign out
          </button>
          <div style={{ marginTop: 16 }}>
            <Link to="/protected">Go to protected page</Link>
          </div>
        </>
      )}
    </div>
  );
}
