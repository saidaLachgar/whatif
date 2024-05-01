import "./App.scss";
import { useEffect, useState } from "react";
import Filter from "./Filter";
import Form from "./Form";
import Modal from "./Modal";
import Post from "./Post";
import Icon from "../components/Icon";
import { TPost, getPosts } from "src/api/getPosts";


const Home = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<TPost[]>([]);

  useEffect(() => {
    void async function fetchPosts() {
      try {
        const newPosts = await getPosts();
        setPosts(newPosts);
      } catch (error) {
        // Handle error here, such as logging or showing a message to the user
        console.error('Error fetching posts:', error);
      }
    }();
  }, []);

  console.log(posts);


  return (
    <main className="Main">
      <Icon className="Logo" name="logo" />
      <section className="Header">
        <div className="Header__Title">
          <h1 className="Header__TitleText">What If There Is An App ?<br />From Imagination to Implementation</h1>
          <p className="Header__TitleCaption">
            sharing creative website and app ideas.&nbsp;
            <span onClick={() => { setIsModalOpen(true) }}>Learn more</span>
          </p>
        </div>
        <Form />
        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} />
      </section>

      <section className="Listing">
        <h2 className="Listing__title">Discover</h2>
        <Filter />
        <div className="Listing__posts">
          {[...Array(90)].map((_post, index) => (
            <Post key={index} />
          ))}
        </div>
      </section>
    </main>
  )
}
export default Home
