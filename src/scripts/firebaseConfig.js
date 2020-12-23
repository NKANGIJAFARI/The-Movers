
  import * as firebase from 'firebase/app'
  import 'firebase/firestore';
  import 'firebase/auth';
  import 'firebase/storage';
  import 'firebase/database';
  import 'firebase/functions';
const config = { 
  apiKey: "AIzaSyC02Z7PR7MWpzUJWmEoWQMp0bVipJbBeBY",
  authDomain: "the-movers-2020.firebaseapp.com",
  databaseURL: "https://the-movers-2020.firebaseio.com",
  projectId: "the-movers-2020",
  storageBucket: "the-movers-2020.appspot.com",
  messagingSenderId: "359392453825",
  appId: "1:359392453825:web:13a912999366a221e1a040",
  measurementId: "G-KP8JHT8SCE"
};

export default !firebase.apps.length 
  ? firebase.initializeApp(config).firestore()
  : firebase.app().firestore();
  export const db = firebase.firestore();
  export const auth = firebase.auth();
  export const storage = firebase.storage()
  export const database = firebase.database();
  export const functions = firebase.functions();
  