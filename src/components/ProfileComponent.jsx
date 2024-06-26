import React, { useState } from "react";
import { Link } from 'react-router-dom'; 
import ProfileCard from "./common/ProfileCard";
import ProfileEdit from "./common/ProfileEdit";

export default function ProfileComponent({ currentUser }) {
  const [isEdit, setisEdit] = useState(false);

  const onEdit = () => {
    setisEdit(!isEdit);
  };
  return ( /* BARIS */
    <div>
      {isEdit ? (
        <>
        
          <ProfileEdit onEdit={onEdit} currentUser={currentUser} />
         
        </>
      ) : (
        <>
          {/* <ProfileCard currentUser={currentUser} onEdit={onEdit} /> */}
          <ProfileCard currentUser={currentUser} />
          
        </>
      )}
    </div>
  );
  
}