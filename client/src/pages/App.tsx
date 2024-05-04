import "./App.scss";
import Icon from "src/components/Icon";
import Header from "./Header";
import Listing from "./Listing";


const Home = (): JSX.Element => (
  <main className="Main">
    <Icon className="Logo" name="logo" />
    <Header />
    <Listing />
  </main>
)
export default Home
