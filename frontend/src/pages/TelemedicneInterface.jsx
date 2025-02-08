import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const TelemedicineInterface = () => {
  const { roomID = "room-1" } = useParams(); // Provide default roomID

  useEffect(() => {
    // Initialize meeting when component mounts
    const initMeeting = async (element) => {
      try {
        const appID = 1226140493;
        const serverSecret = "e3470640a32e89cc25ad305995f1cf8a";
        
        // Generate kit token with proper user ID and name
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          Date.now().toString(), // User ID
          "Manasvi Kweera"  // User name
        );

        // Create Zego instance
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Join room with proper configuration
        await zp.joinRoom({
          container: element,
          sharedLinks: [{
            name: 'Personal link',
            url: `${window.location.protocol}//${window.location.host}/room/${roomID}`
          }],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneOnOneCall // Fixed typo in OneOnOneCall
          },
          showScreenSharingButton: true,
          showPreJoinView: true,
          showUserList: false,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
        });
      } catch (error) {
        console.error("Failed to join room:", error);
      }
    };

    // Get container element and initialize meeting
    const container = document.getElementById('zego-container');
    if (container) {
      initMeeting(container);
    }
  }, [roomID]); // Re-run when roomID changes

  return (
    <div 
      id="zego-container" 
      className="w-full h-screen"
    />
  );
};

export default TelemedicineInterface;