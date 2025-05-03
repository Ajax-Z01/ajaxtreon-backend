const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://inventory-management-2ca9c-default-rtdb.asia-southeast1.firebasedatabase.app/'
  });
}

module.exports = admin;
