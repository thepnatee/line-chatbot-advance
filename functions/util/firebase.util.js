const {
  initializeApp,
  cert
} = require('firebase-admin/app');
const {
  getFirestore
} = require('firebase-admin/firestore');

const serviceAccount = require('../firebase_key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const userDb = db.collection("user")

/* Insert Member by userId and groupId */
exports.insertUserGroup = async (userId, groupId) => {

  const profile = await util.getProfileGroup(groupId, userId)

  let userDocument = userDb.where("groupId", "==", groupId).where("userId", "==", userId)
  let userCount = await userDocument.count().get()
  if (userCount.data().count === 0) {
      await userDb.add({
          userId: profile.data.userId,
          displayName: profile.data.displayName,
          pictureUrl: profile.data.pictureUrl,
          groupId: groupId,
          createAt: Date.now()
      })

  }
  return profile

}

/*  delete Member by userId and  groupId */
exports.deleteUserGroup = async (userId, groupId) => {

  let userDocument = userDb.where("groupId", "==", groupId).where("userId", "==", userId)
  await userDocument.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
          doc.ref.delete();
      });
  });

}

/*  delete Group by groupId */
exports.deleteGroup = async (groupId) => {

  let userDocument = userDb.where("groupId", "==", groupId)
  await userDocument.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
          doc.ref.delete();
      });
  });

}

/*  count user by groupId */
exports.countUserGroup = async (groupId) => {
  let userDocument = userDb.where("groupId", "==", groupId)
  let userCount = await userDocument.count().get()
  return userCount.data().count
}

/*  Get User Lists by groupId */
exports.getUserGroup = async (groupId) => {
  let arrayUser = []
  const userDocument = await userDb.where("groupId", "==", groupId).get()
  let userCount = await userDb.where("groupId", "==", groupId).count().get()
  if (userCount.data().count > 1) {
      userDocument.forEach((doc) => {
          arrayUser.push(doc.data())
      });
  }
  return (arrayUser.length > 1) ? arrayUser : false
}

