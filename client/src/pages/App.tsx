import "./App.scss";
import { QueryClient, QueryClientProvider } from 'react-query'
import Icon from "src/components/Icon";
import Header from "./Header";
import Listing from "./Listing";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";

const queryClient = new QueryClient();

const Home = (): JSX.Element => {

  useEffect(() => {
    let ipAddress: string | null = window.localStorage.getItem('ipAddress');

    if (ipAddress) {
      return;
    }

    const fetchIpAddress = async () => {
      try {
        const response = await axios.get<AxiosResponse<{ ip: string }>>('https://api.ipify.org?format=json');
        localStorage.setItem('ipAddress', response.data.ip);
      } catch (e) {
        throw new Error('Error fetching the IP address');
      }
    };

    fetchIpAddress();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="Main">
        <Icon className="Logo" name="logo" />
        <Header />
        <Listing />
      </main>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          className: '',
          style: {
            background: '#ffffff',
            color: '#202020',
            fontSize: '14px',
            fontWeight: '500',
            padding: '10px 11px 10px 14px',
            minWidth: '320px',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#222222',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#222222',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default Home
