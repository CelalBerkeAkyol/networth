const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-database-name.firebaseio.com" // your database 
});

const db = admin.firestore();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const postsRef = db.collection('posts');
const userRef = db.collection('users');
const likeRef = db.collection('likes');
const commentsRef = db.collection('comments');
const connectionRef = db.collection('connections');

// Kullanıcı verilerini alma
app.get('/', async (req, res) => {
  res.send("Networth'e hoşgeldiniz.")
});
  
  
// Kullanıcı oluşturma
app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    await userRef.add(user);
    res.status(201).send('User has been added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Tüm kullanıcıları listeleme
app.get('/users', async (req, res) => {
  try {
    const snapshot = await userRef.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Belirli bir kullanıcıyı getirme
app.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userDoc = await userRef.doc(userId).get();
    if (userDoc.exists) {
      res.json({ id: userDoc.id, ...userDoc.data() });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Kullanıcı güncelleme
app.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const payload = req.body;
    await userRef.doc(userId).update(payload);
    res.send('User has been updated successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Kullanıcı silme
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await userRef.doc(userId).delete();
    res.send('User has been deleted successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Gönderi oluşturma
app.post('/posts', async (req, res) => {
  try {
    const post = req.body;
    await postsRef.add(post);
    res.status(201).send('Post has been added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Tüm gönderileri listeleme
app.get('/posts', async (req, res) => {
  try {
    const snapshot = await postsRef.orderBy('timeStamp').get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Belirli bir kullanıcıya ait gönderileri getirme
app.get('/posts/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const snapshot = await postsRef.where('userID', '==', userId).get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Gönderi güncelleme
app.put('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const payload = req.body;
    await postsRef.doc(postId).update(payload);
    res.send('Post has been updated successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Gönderi silme
app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await postsRef.doc(postId).delete();
    res.send('Post has been deleted successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Yorum oluşturma
app.post('/comments', async (req, res) => {
  try {
    const comment = req.body;
    await commentsRef.add(comment);
    res.status(201).send('Comment has been added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Belirli bir gönderiye ait yorumları getirme
app.get('/comments/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const snapshot = await commentsRef.where('postId', '==', postId).get();
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Gönderiye beğeni ekleme
app.post('/likes', async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const docToLike = likeRef.doc(`${userId}_${postId}`);
    await docToLike.set({ userId, postId });
    res.status(201).send('Like has been added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Gönderiden beğeni kaldırma
app.delete('/likes/:userId/:postId', async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const docToUnlike = likeRef.doc(`${userId}_${postId}`);
    await docToUnlike.delete();
    res.send('Like has been removed successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Kullanıcı bağlantısı ekleme
app.post('/connections', async (req, res) => {
  try {
    const { userId, targetId } = req.body;
    const connectionToAdd = connectionRef.doc(`${userId}_${targetId}`);
    await connectionToAdd.set({ userId, targetId });
    res.status(201).send('Connection has been added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Belirli bir kullanıcı bağlantısını kontrol etme
app.get('/connections/:userId/:targetId', async (req, res) => {
  try {
    const { userId, targetId } = req.params;
    const connectionsQuery = connectionRef.where('targetId', '==', targetId);
    const snapshot = await connectionsQuery.get();
    const connections = snapshot.docs.map(doc => doc.data());
    const isConnected = connections.some(connection => connection.userId === userId);
    res.json({ isConnected });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Kullanıcı bağlantısını silme
app.delete('/connections/:userId/:targetId', async (req, res) => {
  try {
    const { userId, targetId } = req.params;
    const connectionToDelete = connectionRef.doc(`${userId}_${targetId}`);
    await connectionToDelete.delete();
    res.send('Connection has been deleted successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.post('/messages', async (req, res) => {
  const { sender, content } = req.body;
  const newMessage = { sender, content, timestamp: admin.firestore.FieldValue.serverTimestamp() };
  const messageRef = await db.collection('messages').add(newMessage);
  res.status(201).send({ id: messageRef.id, ...newMessage });
});

// Tüm mesajları getirme
app.get('/messages', async (req, res) => {
  const snapshot = await db.collection('messages').orderBy('timestamp').get();
  const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(messages);
});

// Belirli bir mesajı getirme
app.get('/messages/:id', async (req, res) => {
  const { id } = req.params;
  const doc = await db.collection('messages').doc(id).get();
  if (!doc.exists) {
    return res.status(404).send({ error: 'Message not found' });
  }
  res.status(200).send({ id: doc.id, ...doc.data() });
});

// Belirli bir mesajı silme
app.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('messages').doc(id).delete();
  res.status(200).send({ message: 'Message deleted' });
});

// Sunucuyu başlatma
app.listen(port, () => {
  console.log(`Sunucu şu adreste çalışıyor: http://localhost:${port}`);
});