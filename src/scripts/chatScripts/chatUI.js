import firebase from '../firebaseConfig';
import {db, auth} from '../firebaseConfig';
import { formatDistanceToNow, formatDistance, subDays } from 'date-fns'


export default class ChatUI {
    constructor(messagesList, chatRoomsList, chatheader){
      this.messagesList = messagesList;
      this.chatRoomsList =chatRoomsList;
      this.chatheader = chatheader
    }
    clear(){
      this.messagesList.innerHTML = '';
      this.chatheader.innerHTML = '';
    }

    // funcPlay(){
    //   console.log("func")
    // }

    startChatRoom(data){
      const when = formatDistanceToNow(
        data.created_at.toDate(),
       { addSuffix:true }
       );

      const roomHtml =`
          <div class="room chat__left--room" id="${data.chat_id}" >
            <div class="chat__left--room__wrap">
              <div class="chat__left--room__img">
               <img src="${data.profilePic}" alt="DP"> 
              </div>
              <div class="chat__left--room__details">
                <h5 class="chat__left--room__details--name">${data.Name}</h5>
                <p class="creationDate chat__left--room__details--date">${when} </p>
              </div>
            </div>
          </div> `
      // `
      // <li id="${data.chat_id}" class="room"> 
      //     <img src="${data.profilePic}" >
      //     <h5>${data.Name}<span id="${data.created_at.seconds}" </span></h5>  
      // </li>
      // `
      this.chatRoomsList.innerHTML += roomHtml;
    }

    chatHead(data){
      const messageHeader = `
      <div class="chat__right--header__wrap" >
     
        <div class="">
          <div class="chat__right--header__imgwrapper">
            <a class="chat__right--header__profLink chatBackButton"> 
              <i class="fas fa-arrow-left chat__right--header__icon"></i>
              <img class="chat__right--header__img" src="${data.profilePic}" alt="DP"> 
            </a>
          </div>
          <div class="chat__right--header__details">
          <i class="fad fa-arrow-alt-left chat__right--header__icon" ></i>
            <h5 class="chat__right--header__details--name">${data.Name}</h5>
            <p class="creationDate chat__right--header__details--date">last seen at 7:00pm </p> 
          </div>
        </div> 
    </div>`
    this.chatheader.innerHTML += messageHeader; 
    }

    displayMessages(data){
     const when = formatDistanceToNow(
       data.created_at.toDate(),
      { addSuffix:true }
      );

    const incomingMsg = ` 
      <div class="incoming_msg">
        <div class="received_msg">
          <p>${data.message}</p>
          <span class="received_time_date">${when}</span>
        </div>
      </div>`;

      const outgoingMsg =`
        <div class="outgoing_msg">
          <div class="sent_msg">
            <p>${data.message}</p>
            <span class="sent_time_date">${when}</span>
            </div>
        </div>
      `

    const chatWindow = this.messagesList;
     
    // if(roomId === data.chat_id)    
       // allow 1px inaccuracy by adding 1
       const isScrolledToBottom = chatWindow.scrollHeight - chatWindow.clientHeight <= chatWindow.scrollTop + 1;
       if(data.message_to === auth.currentUser.uid){
          chatWindow.innerHTML += incomingMsg;
      }else{
          chatWindow.innerHTML += outgoingMsg;
      }
      // scroll to bottom if isScrolledToBottom is true
      if (isScrolledToBottom) {
        chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight;
      }
  }
}

