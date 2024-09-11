const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const router = express.Router();

router.use(cors());

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_x509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
  });
}

const db = admin.firestore();

const getById = async (collection, id) => {
  const docRef = db.collection(collection).doc(id);
  const doc = await docRef.get();
  const data = doc.data();
  let updated_at;
  let created_at;
  if (data?.updated_at) updated_at = data.updated_at.toDate();
  if (data?.created_at) created_at = data.created_at.toDate();
  return { id: doc.id, ...doc.data(), updated_at, created_at };
};

router.post("/", async (req, res) => {
  const { collection, data } = req.body;
  data.updated_at = new Date();
  data.created_at = new Date();
  data.archived = false;

  const docRef = await db.collection(collection).add(data);

  res.send({ id: docRef.id, doc: await getById(collection, docRef.id) });
});

router.patch("/", async (req, res) => {
  const { collection, id, data } = req.body;
  data.updated_at = new Date();

  await db.collection(collection).doc(id).update(data);

  res.send({ id: id, doc: await getById(collection, id) });
});

router.post("/single", async (req, res) => {
  const { id, collection } = req.body;
  res.send(await getById(collection, id));
});

router.post("/get", async (req, res) => {
  const { collection, where, order, limit, search } = req.body;
  let collectionRef = db.collection(collection);
  collectionRef = collectionRef.where("archived", "==", false);
  if (where)
    where.forEach((item) => {
      if (!item.value) return;
      collectionRef = collectionRef.where(
        item.field,
        item.operator,
        item.value
      );
    });

  if (order)
    order.forEach((item) => {
      collectionRef = collectionRef.orderBy(item.field, item.type);
    });

  if (limit) collectionRef = collectionRef.limit(limit);

  try {
    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      res.send({ empty: true });
      return;
    }
    const docs = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      let updated_at;
      let created_at;
      if (data.updated_at) updated_at = data.updated_at.toDate();
      if (data.created_at) created_at = data.created_at.toDate();
      const values = { id: doc.id, ...doc.data(), updated_at, created_at };
      if (search) {
        if (values[search.field].includes(search.value)) docs.push(values);
      } else docs.push(values);
    });
    res.send(docs);
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
});

router.post("/count", async (req, res) => {
  const { collection, where } = req.body;
  let collectionRef = db.collection(collection);

  collectionRef = collectionRef.where("archived", "==", false);

  if (where)
    where.forEach((item) => {
      if (!item.value) return;
      collectionRef = collectionRef.where(
        item.field,
        item.operator,
        item.value
      );
    });

  try {
    const snapshot = await collectionRef.count().get();
    res.send({ count: snapshot.data().count });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
});

module.exports = router;
