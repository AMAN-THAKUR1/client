import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to ChatRoom</h1>
      <p className="home-subtitle">Create or join a room to start chatting</p>
      <div className="home-actions">
        <Link to="/Croom" className="btn-primary">Create Room</Link>
        {/* <Link to="/Jroom" className="btn-secondary">Join Room</Link> */}
        <Link to="/Jroom" className="btn-secondary">Join Room</Link>
      </div>
    </div>
  );
};

export default Home;