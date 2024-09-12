import CreateRoom from "../Components/CreateRoom";

const Home: React.FC = () => {
  console.log("Rendering Home Page");
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
      <CreateRoom />
    </div>
  );
};

export default Home;
