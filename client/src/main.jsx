import React from 'react';
import ReactDOM from 'react-dom/client';
import { LogtoProvider } from '@logto/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Callback from './pages/Callback';
import Protected from './pages/Protected';

const config = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APP_ID,
  resources: [import.meta.env.VITE_LOGTO_RESOURCE],
  scopes: import.meta.env.VITE_LOGTO_SCOPES.split(' '),
};

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/callback', element: <Callback /> },
  { path: '/protected', element: <Protected /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LogtoProvider config={config}>
      <RouterProvider router={router} />
    </LogtoProvider>
  </React.StrictMode>
);
