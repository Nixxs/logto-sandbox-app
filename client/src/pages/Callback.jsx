import { useHandleSignInCallback } from '@logto/react';

export default function Callback() {
  const { isLoading, error } = useHandleSignInCallback(() => {
    window.location.replace('/');
  });

  if (isLoading) return <div style={{ padding: 24 }}>Completing sign-in…</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{String(error)}</div>;
  return null;
}
