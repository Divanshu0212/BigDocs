import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
  import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

(() => {
  window.alert = () => false;
  window.confirm = () => true;
  window.prompt = () => null;
  window.onbeforeunload = null;
  window.onerror = () => true;
})();


const TelemedicineInterface = () => {
  const { roomID = "room-1" } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMeeting = async (element) => {
      try {
        const appID = 1226140493;
        const serverSecret = "e3470640a32e89cc25ad305995f1cf8a";
        
        // Generate a more reliable user ID
        const userID = Math.floor(Math.random() * 10000).toString();
        
        // Generate token with specific role and privileges
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          "Manasvi Kweera",
          7200 // Token expiry time in seconds (2 hours)
        );

        // Create Zego instance with specific constraints
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Configure WebRTC options
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 24 }
          },
          audio: true
        };

        await zp.joinRoom({
          container: element,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneOnOneCall,
            config: {
              role: 'Host', // or 'Audience'
              audioVideoConfig: constraints
            }
          },
          showScreenSharingButton: false, // Disable screen sharing initially
          showPreJoinView: true,
          showUserList: false,
          turnOnMicrophoneWhenJoining: false, // Let user choose
          turnOnCameraWhenJoining: false, // Let user choose
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          onJoinRoom: () => {
            console.log('Successfully joined room');
          },
          onLeaveRoom: () => {
            console.log('Left room');
          },
          onError: (error) => {
            console.error('Zego error:', error);
            setError(error.message);
          }
        });

      } catch (error) {
        console.error("Failed to initialize meeting:", error);
        setError(error.message);
      }
    };

    const container = document.getElementById('zego-container');
    if (container) {
      initMeeting(container);
    }

    // Cleanup
    return () => {
      // Clean up WebRTC connections
      if (window.stream) {
        window.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomID]);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="zego-container" 
      className="w-full h-screen"
    />
  );
};

export default TelemedicineInterface;