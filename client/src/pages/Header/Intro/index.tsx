import './index.scss';
import Modal from './Modal';
import { useState } from 'react';

const Intro = (): JSX.Element | null => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="Intro">
      {/* <h1 className="Intro__Title">What If There Is An App ?<br />From Imagination to Implementation</h1> */}
      <h1 className="Intro__Title">A Hub For Creative Minds<br />To Share And Discover Ideas</h1>
      <p className="Intro__Caption">
        Built for creators, and innovators.{' '}
        {/* Sharing creative website and app ideas,{' '} */}
        <span onClick={() => { setIsModalOpen(true) }}>Read more</span>
      </p>
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} />
    </div>
  );
};

export default Intro;
