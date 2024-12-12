import './index.scss';
import Icon from 'src/components/Icon';
import image from '/images/vote.png';
import CopyLink from './CopyLink';
import useOutside from "src/utils/useOutside";
import React, { useRef } from 'react';

interface Props {
  onClose(): void,
  isOpen?: boolean,
}

const Modal = ({ isOpen, onClose }: Props): React.JSX.Element | null => {
  const modalRef = useRef(null);
  useOutside(modalRef, () => onClose());
  if (!isOpen) {
    return null;
  }

  return (
    <div className="Modal">
      <div className="Modal__container" ref={modalRef}>
        <div className="Modal__content">
          <button className="Modal__close" onClick={onClose}>
            <Icon name='close' />
          </button>
          <div className="Modal__left">
            <p className='Modal__left__title'>Fostering Innovation</p>
            <p className='Modal__left__text'>This is a platform where people can share their ideas for websites and  apps 🌐, fostering creativity and innovation 💡. It could also serve as a  valuable resource for developers and entrepreneurs looking for new  project ideas or opportunities to improve existing platforms.<br />
              <br /><b>Like the idea ? share with world!</b></p>
            <div className='Modal__links'>
              <CopyLink />
              <span>or</span>
              <a className='Modal__links_item' target='_blank' href={`https://twitter.com/share?url=${window.location.origin}&text=A platform where people can share their ideas for websites and  apps`}><Icon name='x' /></a>
              <a className='Modal__links_item' target='_blank' href={`http://www.facebook.com/sharer.php?u=${window.location.origin}`}><Icon name='facebook' /></a>
              <a className='Modal__links_item' target='_blank' href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}`}><Icon name='linkedin' /></a>
            </div>
            <br />
            <a href="https://www.producthunt.com/posts/developer-projects-ideas?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-developer&#0045;projects&#0045;ideas" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=696522&theme=neutral" alt="Developer&#0032;projects&#0032;ideas - A&#0032;Hub&#0032;for&#0032;creative&#0032;minds&#0032;to&#0032;share&#0032;and&#0032;discover&#0032;ideas | Product Hunt" width="190" /></a>
            <br />
            <a
              href='https://github.com/saidaLachgar/whatif' target='_blank'
              style={{ display: 'inline-block', marginTop: 15 }}
            >
              <Icon name='github' />&nbsp;
              <small style={{ verticalAlign: 3 }}><b>Open Source</b></small>
            </a>
          </div>
          <div className="Modal__right">
            <img src={image} alt="" width="471" height="632" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
