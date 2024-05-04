import './index.scss';
import Form from './Form';
import Intro from './Intro';

const Header = (): JSX.Element | null => (
  <section className="Header">
    <Intro />
    <Form />
  </section>
);

export default Header;
