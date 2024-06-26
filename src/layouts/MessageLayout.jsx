import React, { useMemo, useState } from "react";
import Message from "../Pages/Message";
import { getCurrentUser } from "../api/FirestoreAPI";
import Topbar from "../components/common/Topbar";

export default function MessageLayout() {
  const [currentUser, setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  return (
    <div>
      <Topbar currentUser={currentUser} />
      <Message currentUser={currentUser} />
    </div>
  );
}
