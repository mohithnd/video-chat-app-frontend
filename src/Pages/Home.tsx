import CreateRoom from "../Components/CreateRoom";

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <CreateRoom />
    </div>
  );
};

export default Home;
