import React, { useEffect, useState } from "react";
import { getAllUsers, removeConnection } from "../api/FirestoreAPI";
import ConnectedUsers2 from "./common/ConnectedUsers2/index";
import "../Sass/ConnectionsTableCOMP.scss";

export default function ConnectionsTableComponent({ currentUser }) {
  const [users, setUsers] = useState([]);

  const getCurrentUser = (id) => {
    removeConnection(currentUser.id, id);
  };

  useEffect(() => {
    // Eğer mevcut kullanıcı içinde connections varsa, bu direkt olarak kullanılır
    if (currentUser.connections && currentUser.connections.length > 0) {
      setUsers(currentUser.connections);
    } else {
      // Eğer connections yoksa veya güncel değilse, tüm kullanıcıları getir
      getAllUsers((fetchedUsers) => {
        setUsers(fetchedUsers);
      });
    }
  }, [currentUser]); // currentUser değiştiğinde useEffect tekrar çalışacak

  console.log(currentUser); // Kullanıcı verilerini kontrol etmek için

  return users.length > 0 ? (
    <div className="connections-main">
      {users.map((user) => {
        return user.id === currentUser.id ? (
          <div key={user.id}></div>
        ) : (
          <ConnectedUsers2
            key={user.id}
            currentUser={currentUser}
            user={user}
            getCurrentUser={getCurrentUser}
          />
        );
      })}
    </div>
  ) : (
    <div className="connections-main">No Connections to remove!</div>
  );
}
