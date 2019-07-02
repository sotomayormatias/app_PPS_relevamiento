export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCUHh7WPJRXHXK2fl037licx9MqznCmROE",
  authDomain: "revisual-9db2c.firebaseapp.com",
  databaseURL: "https://revisual-9db2c.firebaseio.com",
  projectId: "revisual-9db2c",
  storageBucket: "revisual-9db2c.appspot.com",
  messagingSenderId: "440188669853"
};

export const snapshotToArray = snapshot => {
  let returnArray = [];
  snapshot.forEach(element => {
    let item = element.val();
    item.key = element.key;
    returnArray.push(item);
  });

  return returnArray;
}