import React, { useMemo, useState } from "react";
import ConnectionsTableComponent from "../Pages/ConnectionsTable";
import { getCurrentUser } from "../api/FirestoreAPI";
import Topbar from "../components/common/Topbar";

export default function ConnectionTableLayout() {
  const [currentUser, setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div>
      <Topbar currentUser={currentUser} />
      <ConnectionsTableComponent currentUser={currentUser} />
    </div>
  );
}