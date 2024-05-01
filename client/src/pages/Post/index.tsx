import Icon from 'src/components/Icon';
import './index.scss';

const Post = (): JSX.Element | null => {
  return (
    <div className="Post">
      <div className="Post__Header">
        <span className="Post__Author">POSTED BY YOU</span>
        <div className="Post__Reviewing">
          <Icon name="time" className="Post__ReviewingIcon" />
          <div className="Post__ReviewingInfo">
            <b>Thanks for sharing your idea!</b>
            <p>
              we're reviewing it to ensure it meets our guidelines. this typically takes a day.&nbsp;
              <span className="Post__Cancel">cancel post</span>
            </p>
          </div>
        </div>
      </div>
      <div className="Post__Date">12 APRIL 2024</div>
      <div className="Post__Content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vitae soluta dolorum saepe, perferendis provident dolor voluptates aut numquam officiis accusamus eligendi obcaecati, #insta fuga atque earum eaque quibusdam quia</div>
      <div className="Post__Rating">
        <p className="Post__Rating__Up">
          <Icon name="arrow" />
          <span>Upvote . 119</span>
        </p>
        <p className="Post__Rating__Down"><Icon name="arrow" /></p>
      </div>
    </div>
  );
};

export default Post;
