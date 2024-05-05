import "./App.scss";
import { QueryClient, QueryClientProvider } from 'react-query'
import Icon from "src/components/Icon";
import Header from "./Header";
import Listing from "./Listing";

const queryClient = new QueryClient();

const Home = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="Main">
        <Icon className="Logo" name="logo" />
        <Header />
        <Listing />
      </main>
    </QueryClientProvider>
  );
}

export default Home
