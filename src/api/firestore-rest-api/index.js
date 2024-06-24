const API_BASE_URL = 'http://localhost:3000';


// İstemci Fonksiyonları
export const getCurrentUser = async () => {
  try {
    const userEmail = await getCurrentUser();
    console.log("Current user" + getCurrentUser);
    if (!userEmail) {
      throw new Error('User email not found in localStorage');
    }

    console.log('Sending userEmail:', userEmail); // Debug için log ekleyin

    const response = await fetch(`${API_BASE_URL}/currentUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-email': userEmail,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch current user');
    }
  } catch (err) {
    console.error('Error fetching current user:', err);
    throw err;
  }
};

export const editProfile = async (userId, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to edit profile');
    }
  } catch (err) {
    console.error('Error editing profile:', err);
    throw err;
  }
};

export const getSingleStatus = async (setAllStatus, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`);
    if (response.ok) {
      const statuses = await response.json();
      setAllStatus(statuses);
    } else {
      throw new Error('Failed to fetch statuses');
    }
  } catch (err) {
    console.error('Error fetching statuses:', err);
  }
};

export const getSingleUser = async (setCurrentUser, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
    if (response.ok) {
      const user = await response.json();
      setCurrentUser(user);
    } else {
      throw new Error('Failed to fetch user');
    }
  } catch (err) {
    console.error('Error fetching user:', err);
  }
};

export const getConnections = async (userId, targetId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/${userId}/${targetId}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch connections');
    }
  } catch (err) {
    console.error('Error fetching connections:', err);
    throw err;
  }
};

export const addConnection = async (userId, targetId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, targetId }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to add connection');
    }
  } catch (err) {
    console.error('Error adding connection:', err);
    throw err;
  }
};

export const getAllUsers = async (setUsers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (response.ok) {
      const users = await response.json();
      setUsers(users);
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (err) {
    console.error('Error fetching users:', err);
  }
};

// Kullanıcı ekleme fonksiyonu
export const postUserData = async (user) => {
  try {
    await userRef.add(user);
    return 'User has been added successfully';
  } catch (err) {
    throw new Error(err.message);
  }
};
