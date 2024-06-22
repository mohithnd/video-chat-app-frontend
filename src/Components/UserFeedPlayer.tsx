import { useEffect, useRef } from "react";

const UserFeedPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg w-80 h-60 bg-gradient-to-br from-purple-400 to-purple-600">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={true}
        autoPlay
      />
    </div>
  );
};

export default UserFeedPlayer;
