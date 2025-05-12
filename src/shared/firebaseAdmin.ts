import * as admin from 'firebase-admin';
import * as path from 'path';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://inventory-management-2ca9c-default-rtdb.asia-southeast1.firebasedatabase.app/',
  });
}

export default admin;
