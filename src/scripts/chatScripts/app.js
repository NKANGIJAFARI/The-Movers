
import firebase from '../firebaseConfig';
import {db, auth} from '../firebaseConfig';
import Chatroom from './chats';
import ChatUI from './chatUI';



//dom queries
const messagesList = document.querySelector('.mesagesList');
const chatRoomsList = document.querySelector('.chatRoomsList');
const sendMessageForm = document.querySelector('.sendMessageForm');
const sendMessageFormWrapper = document.querySelector('.sendMessageFormWrapper');
const chatheader = document.querySelector('.chat__right--header')
const chatLeft = document.querySelector('.chat__left');
const chatRight = document.querySelector('.chat__right');


const addNewMessageForm = document.querySelector('.addNewMessageForm');
const addNewMessageBtn = document.querySelector('.addNewMessageBtn');




//Check if User is loggedIn so that to access our chat and its functionality
auth.onAuthStateChanged(user=>{
  if(user){
    //Class Instances
    const chatroom = new Chatroom(auth.currentUser.uid);
    const chatUI = new ChatUI(messagesList, chatRoomsList, chatheader);

    if(window.screen.width < 700){
      chatRight.classList.remove('inactive');
    }
    //Get chat Id and receiverId of selected room
    let chatID = null;
    let receiverIdForRoom = null;
    let  chatroomsArray = [];

   chatRoomsList.addEventListener('mouseenter', (e)=>{
     e.stopPropagation();
  
     if(e.currentTarget.classList.contains('chatRoomsList')){
       const rooms = Array.from(e.currentTarget.children);
       
       rooms.forEach(room=>{
        room.addEventListener('click', async(event)=>{
          event.stopPropagation();

          chatLeft.classList.add('inactive');
          chatRight.classList.remove('inactive');

          if(event.currentTarget.getAttribute('id') === chatID){
            return
          }

          chatID = null;
  
    // Whenever a room is clicked at, we get its id attribute which is the chatID,
    // And then we split it with a '-' so we can get a sender id, if one id is same as
    //auth.currentUser.id, the other must be the receiver Id.

          chatID = event.currentTarget.getAttribute('id');

          const [id1, id2] = chatID.split('-');
          if(auth.currentUser.uid === id1){
            receiverIdForRoom = id2;
          }else{
            receiverIdForRoom = id1;
          }
          chatUI.clear();
          sendMessageFormWrapper.style.display = "block";

    //Iterate through the rooms, get the room whose Id is same as selected room
    //Give the room object to the chatHead function to show the chat head of selected chat
          chatroomsArray.forEach(room=>{
            if(room.chat_id === chatID ){
              chatUI.chatHead(room);
            }
          })

 
        const chatBackButton = document.querySelector('.chatBackButton');
        
        chatBackButton.addEventListener('click', (e)=>{
          console.log(e.currentTarget.classList.contains('chatBackButton'))
          if(e.currentTarget.classList.contains('chatBackButton')){
            //Give the chatlist a ting 
            chatRight.classList.add('inactive');
            chatLeft.classList.remove('inactive');
          }
        })

          //chatroom.getChatId(roomIdentity); 
          await chatroom.getMessages(chatID, chats => {chatUI.displayMessages(chats)});

          if(!event.currentTarget.classList.contains("active_chat")){
            rooms.forEach(room=>room.classList.remove("active_chat"));
            event.currentTarget.classList.add("active_chat");
          }
          


          // chatroom.markReadMessage()

        })
      })
     }
   })




    //Get chatrooms and send them into the DOM. getChatrooms is a method from chats
    //file and startChatroom is from ChatUI
    const getRooms = async()=>{
       await chatroom.getChatrooms(data=>{
         chatUI.startChatRoom(data);
         chatroomsArray.push(data);
       } 
       )
    }

    getRooms().catch(error=>console.log(error.message));


     //Below is to enter an email for a new message
    addNewMessageBtn.addEventListener('click', ()=>{
        addNewMessageBtn.style.display = "none";
        addNewMessageForm.style.display = "block";
    })

    addNewMessageForm.addEventListener('submit', e=>{
      e.stopPropagation();
      e.preventDefault();
      const enteredNewEmail = addNewMessageForm['enterEmailAddress'].value.toLowerCase().trim();
      combinedUserIdsForMessage(enteredNewEmail);
      addNewMessageForm.style.display = "none";
      addNewMessageBtn.style.display = "block";
      addNewMessageForm.reset();
    })



    //Function to join userIds for sender and Receiver to make a chat thread,
    //Receiver Id is got from the users collection by comparing entered email
    //with user ids in the database.
    const combinedUserIdsForMessage = async (enteredNewEmail) =>{
      const currentUserId = auth.currentUser.uid;
      
      if(auth.currentUser.email === enteredNewEmail){
        throw new Error('This is your email')
      }

      const users = await db.collection('users').where("email", "==", enteredNewEmail).get();
        users.docs.forEach(user =>{
           if(user.data().email === enteredNewEmail){
            const receiverIdToStartRoom = user.data().userId;
            // chatroom.getReceiversID(receiverIdToStartRoom);
                let combinedUserId;
                if(currentUserId < receiverIdToStartRoom){
                  combinedUserId = currentUserId +"-"+ receiverIdToStartRoom;
                  
                }else{
                  combinedUserId = receiverIdToStartRoom +"-"+ currentUserId ;
                  chatroom.addChatroom(user.data(), combinedUserId);
                  }
          }else{console.log("Email doesn't exists")}
          })  
     }

 
//This is the send message form
sendMessageForm.addEventListener('submit', async(e) => {
  e.preventDefault();
  const message = sendMessageForm['new-msg-input'].value.trim();
  // if(!message){
  //   throw new Error("Please you can't send empty message");
  // }  
  try {
    await chatroom.addChat(message, chatID, receiverIdForRoom);
    const currentUserInfo = await db.collection('users').doc(auth.currentUser.uid).get();
    chatroom.addChatInRecieverChatRoom(chatID, currentUserInfo.data(), receiverIdForRoom);
    sendMessageForm.reset();
  } catch (error) {
    console.log(error, error.message)
  }
});

//The end of all activities for a logged in user
  }else{
    console.log("Please sign in to send messages");
  }
  });


 