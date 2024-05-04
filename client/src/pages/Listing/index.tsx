import './index.scss';
import { useEffect, useState } from 'react';
import { TPost } from 'src/model/post';
import api from 'src/api/posts';
import Filter from './Filter';
import Post from './Post';


const Listing = (): JSX.Element | null => {

  const [posts, setPosts] = useState<TPost[]>([]);

  useEffect(() => {
    void async function fetchPosts() {
      try {
        const newPosts = await api.getPosts();
        setPosts(newPosts);
        console.log(newPosts);

      } catch (error) {
        // Handle error here, such as logging or showing a message to the user
        console.error('Error fetching posts:', error);
      }
    }();
  }, []);

  console.log(posts);

  return (
    <section className="Listing">
      <h2 className="Listing__title">DISCOVER</h2>
      <Filter />
      <div className="Listing__posts">
        {posts?.map((post, index) => (
          <Post key={index} data={post} />
        ))}
      </div>
    </section>
  );
};

export default Listing;
