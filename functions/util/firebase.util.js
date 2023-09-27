const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();
// const serviceAccount = require('../firebase_key.json');

// initializeApp({
//   credential: cert(serviceAccount)
// });

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


const moment = require('moment-timezone');

/* Insert publicUrl by groupId */
exports.insertImageGroup = async (groupId, messageId, publicUrl) => {

  const date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD')

  await imagesDb.add({
    groupId: groupId,
    messageId: messageId,
    publicUrl: publicUrl,
    date: date
  })
}

/* Update Tag Image */
exports.updateTagImage = async (groupId, messageId, tag) => {
  let userDocument = imagesDb.where("groupId", "==", groupId).where("messageId", "==", messageId)
  await userDocument.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      imagesDb.doc(doc.id).update({
        tag: tag
      })
    });
  });
}

/* Save image to cloud storage */
exports.saveImageToStorage = async (message, groupId, binary) => {
  const date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD')
  const storageBucket = storage.bucket(bucketName);
  let extension = getExtension(message, message.type)
  const file = storageBucket.file(`${groupId}/${date}/${message.id}.${extension}`);
  await file.save(binary.data);
  file.makePublic()
  return file.publicUrl()
};


function getExtension(message, messageType) {
  let extension = '';
  switch (messageType) {
    case "image":
      extension = 'png';
      break;
    case "video":
      extension = 'mp4';
      break;
    case "audio":
      extension = 'm4a';
      break;
    case "file":
      const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      const match = regex.exec(message.fileName);
      extension = match ? match[1] : '';
      break;
  }

  return extension

}
