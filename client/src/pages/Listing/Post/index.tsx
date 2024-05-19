import './index.scss';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TPost } from 'src/model/post';
import Icon from 'src/components/Icon';

interface Props {
  data: TPost;
  handleCancelPost(id?: string): void;
}

const REGEX = /(#\w+)/g; // Regular expression to find hashtags
const Post = ({ data, handleCancelPost }: Props): JSX.Element | null => {
  const isAuthor = useMemo(() => (
    window.localStorage.getItem('ipAddress') === data.ipAddress
  ), [data.ipAddress]);

  const date = useMemo(() => (
    data.date ? new Date(data.date).toLocaleDateString(
      'en-GB',
      { day: '2-digit', month: 'long', year: 'numeric' }
    ).toUpperCase() : null
  ), [data.date]);

  const content = useMemo(() => (
    data.content?.split(REGEX).map((part, index) => {
      if (part.startsWith('#')) {
        const tag = part.substring(1);
        return <Link to={`/${tag}`} key={index}>#{tag}</Link>;
      }
      return part;
    })
  ), [data.content]);

  return (
    <div className="Post">
      {isAuthor &&
        <div className="Post__Header">
          <span className="Post__Author">POSTED BY YOU</span>
          {!data.reviewed &&
            <div className="Post__Reviewing">
              <Icon name="time" className="Post__ReviewingIcon" />
              <div className="Post__ReviewingInfo">
                <b>Thanks for sharing your idea!</b>
                <p>
                  we're reviewing it to ensure it meets our guidelines. this typically takes a day.&nbsp;
                  <span
                    onClick={() => { handleCancelPost(data._id); }}
                    className="Post__Cancel"
                  >cancel post</span>
                </p>
              </div>
            </div>
          }
        </div>
      }
      <div className="Post__Date">{date}</div>
      <div className="Post__Content">{content}</div>
      <div className="Post__Rating">
        <p className="Post__Rating__Up">
          <Icon name="arrow" />
          <span>Upvote . {(data.upvotes?.length || 0) - (data.downvotes?.length || 0)}</span>
        </p>
        <p className="Post__Rating__Down"><Icon name="arrow" /></p>
      </div>
    </div>
  );
};

export default Post;
