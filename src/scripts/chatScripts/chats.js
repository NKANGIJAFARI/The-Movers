
//  import firebase from '../firebaseConfig';
import * as firebase from 'firebase/app'
import 'firebase/firestore';
 import {db, auth} from '../firebaseConfig';
import { data } from 'jquery';

  //Room should be the combinedUserId
 export default class Chatroom {
    constructor(senderId){
        this.receiverId;
        // this.receiverIdToStartRoom;
        this.senderId = senderId;
        // this.chatId;
        this.unsub;
    }

    
    // getReceiversID(id){
    //     this.receiverIdToStartRoom = id;
    // }
    //    resetChatId(){
    //     this.chatId = "";
    // }

    // getChatId(roomId){
    //     console.log("This is froom getchat",this.chatId);
    //     this.chatId = null;
    //     this.chatId = roomId;
    //     const [id1, id2] = roomId.split("-");
    //     if(auth.currentUser.uid===id1){
    //         this.receiverId = id2;
    //     }else{
    //         this.receiverId = id1;
    //     } 
    //     console.log('This is the room', roomId)
    // }

    async addChat(message, chatID, receiverId){
        // format a chat object

        const now = new Date();
        const chat = {
            message: message,
            message_status: "closed",
            message_to: receiverId,
            message_from: this.senderId,
            chat_Id: chatID,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        await db.collection('chats').doc(chatID)
                    .collection('messages').add(chat);   
        // const updateChatroomDate = await db.collection('chatrooms').doc(this.senderId)
        //                 .collection('rooms').doc(this.chatId).update({
        //                      "created_at" : firebase.firestore.Timestamp.fromDate(now)
        // }) 
        
        // const updateChatroomDateOfReceiver = await db.collection('chatrooms').doc(this.receiverId)
        // .collection('rooms').doc(this.chatId).update({
        //      "created_at" : firebase.firestore.Timestamp.fromDate(now)
        // }) 
    }


//WILL BE USED TO SEND MESSAGE IN HOMEPAGE AND PROPERTY PAGE
    async addChat2(message, receiverId, chatID){
        // format a chat object
        const now = new Date();
        const chat = {
            chat_Id: chatID,
            message: message,
            message_to: receiverId,
            message_from: this.senderId,
            message_status: "closed",
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
         await db.collection('chats')
                        .doc(chatID).collection('messages')
                        .add(chat);   
        // const updateChatroomDate = await this.chatrooms.doc(this.chatId).update({
        //     "created_at" : firebase.firestore.Timestamp.fromDate(now)
        // })  
        // return updateChatroomDate;
    }
    //WILL BE USED TO SEND MESSAGE IN HOMEPAGE AND PROPERTY PAGE
    async addChatInRecieverChatRoom2(data, receiverId, chatID){
        const now = new Date();
        const roomDetails = {
            Name: data.Name,
            profilePic: data.profilePic,
            chat_id: chatID,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        await db.collection('chatrooms').doc(receiverId)
                        .collection('rooms').doc(chatID).set(
                            roomDetails); 
    }

    async addChatInRecieverChatRoom(chatID, data, receiverId){
        const now = new Date();

        const roomDetails = {
            Name: data.Name,
            profilePic: data.profilePic,
            chat_id: chatID,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        await db.collection('chatrooms').doc(receiverId)
                .collection('rooms').doc(chatID).set(roomDetails);
    }
    

    async addChatroom(data, chatID){
        // format a chat object
        const now = new Date();
        const roomDetails = {
            Name: data.Name,
            profilePic: data.profilePic,
            chat_id: chatID,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        await db.collection('chatrooms').doc(this.senderId)
                .collection('rooms').doc(chatID).set(roomDetails);
    }
    
   async getMessages(chatID, callback) {

       db.collection('chats').doc(chatID).collection('messages')
            .where("chat_Id", "==", chatID)
              .orderBy('created_at')
                .onSnapshot(snapshot=> {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            callback(change.doc.data())
                        }
                        // if (change.type === "modified") {
                        //     console.log("Modified city: ", change.doc.data());
                        // }
                        // if (change.type === "removed") {
                        //     console.log("Removed city: ", change.doc.data());
                        // }
                    });
                });

    }

  async getChatrooms(callback) {
     db.collection('chatrooms').doc(this.senderId)
        .collection('rooms')
            .orderBy("created_at", "desc")
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if(change.type === 'added') {
                            callback(change.doc.data());
                        }
                        if (change.type === "modified") {
                        
                        }
                    });
                });
    } 

    // async markReadMessage(){
    //    const read = await db.collection('chats').doc(this.chatId)
    //      .collection('messages').get().then(querySnapshot =>{
    //         querySnapshot.forEach(doc =>{
    //            if(doc.data().message_to === this.senderId){
    //                doc.ref.update({
    //                    message_status: "opened"
    //            })
    //            }else{return}
    //         })
    //     }
    //    )
    // }

}
