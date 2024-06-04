import './style/style.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'

const router = createBrowserRouter([
  {
    path: "/:sort?/:hashtag?",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
