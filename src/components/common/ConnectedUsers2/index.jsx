import React, { useEffect, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { removeConnection } from "../../../api/FirestoreAPI";

export default function ConnectedUsers2({ user, getCurrentUser, currentUser }) {
  const [isConnected, setIsConnected] = useState(false);
  const [showButton, setShowButton] = useState(true); // State to manage button visibility

  useEffect(() => {
    removeConnection(currentUser.id, user.id, setIsConnected); // Assuming this sets isConnected based on API call
  }, [currentUser.id, user.id]);

  const handleConnectToggle = () => {
    getCurrentUser(user.id); // Assuming this toggles isConnected state

    // Hide the button after it's clicked
    setShowButton(false);
  };

  return (
    <div className="grid-child">
      <img src={user.imageLink} alt={user.name} />
      <p className="name">{user.name}</p>
      <p className="headline">{user.headline}</p>

      {showButton && !isConnected && ( // Only show the button if showButton is true and isConnected is false
        <button onClick={handleConnectToggle}>
          <AiOutlineUsergroupAdd size={20} />
          Remove
        </button>
        
      )}
      
    </div>
  );
}
