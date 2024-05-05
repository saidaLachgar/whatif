import './index.scss';
import Icon from 'src/components/Icon';
import image from '/images/vote.png';
import CopyLink from './CopyLink';

interface Props {
  onClose(): void,
  isOpen?: boolean,
}

const Modal = ({ isOpen, onClose }: Props): JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="Modal">
      <div className="Modal__content">
        <button className="Modal__close" onClick={onClose}>
          <Icon name='close' />
        </button>
        <div className="Modal__left">
          <p className='Modal__left__title'>Fostering Innovation</p>
          <p className='Modal__left__text'>This is a platform where people can share their ideas for websites and  apps 🌐, fostering creativity and innovation 💡. It could also serve as a  valuable resource for developers and entrepreneurs looking for new  project ideas or opportunities to improve existing platforms.<br />
            <br />Like the idea ? share with world!</p>
          <div className='Modal__links'>
            <CopyLink />
            <span>or</span>
            <a className='Modal__links_item' href=''><Icon name='x' /></a>
            <a className='Modal__links_item' href=''><Icon name='facebook' /></a>
            <a className='Modal__links_item' href=''><Icon name='linkedin' /></a>
          </div>
        </div>
        <div className="Modal__right">
          <img src={image} alt="" width="471" height="632" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
