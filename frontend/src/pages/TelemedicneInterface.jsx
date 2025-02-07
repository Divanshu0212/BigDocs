import React, { useRef, useEffect } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const TelemedicineInterface = () => {
  const myMeeting = useRef();

  const myMeetingUI = async (element) => {
    // Generate Kit Token
    const appID = 1953089849;  // Type: Number
    const serverSecret = "30eccf6a89ad0e33dbf5dbdfbd8b01bc"; // Type: String
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      "room-1",  // Room ID
      Date.now().toString(),  // User ID
      "Doctor"  // User Name
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [{
        name: 'Personal link',
        url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=room-1',
      }],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
      showPreJoinView: true,
      showUserList: false,
    });
  };

  useEffect(() => {
    if (myMeeting.current) {
      myMeetingUI(myMeeting.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div 
        className="h-screen"
        ref={myMeeting}
        style={{ width: '100%', height: '100vh' }}
      />
    </div>
  );
};

export default TelemedicineInterface;