import { db, auth } from './firebaseConfig';
import * as firebase from 'firebase/app';
import Chatroom from '../scripts/chatScripts/chats';

setTimeout(()=>{

    // Below is a function to view properties, if the view props button is 
    //Clicked, we get its id which is the property ID both on Front
    // and backend
    const propertyDetails = document.querySelectorAll('.viewDetailsBtn');
    if(propertyDetails.length === 0){
        const failedPropertyLoad = document.querySelector('.failedPropertyLoad');
        //failedPropertyLoad.style.display = "block";
        
        // window.location = 'propertyListing.html';
    }else{ propertyDetails.forEach(property =>{
        property.addEventListener('click', (e)=>{
            e.preventDefault();
            console.log(property);
            const propertyId = e.target.parentElement.getAttribute('id');
            if(propertyId){
                localStorage.setItem("propIdToBeViewed", propertyId)
                window.location = "propertyDetails.html"
            }
        })
    
    })} 


chatFunction();
    
}, 5000)




// Chat functionality
const chatFunction = async() =>{

    const contactBtns = document.querySelectorAll('.landLordContactBtn');
    auth.onAuthStateChanged(user=>{
        if(user){
            
            //Class Instances
            const chatroom = new Chatroom(auth.currentUser.uid);

            contactBtns.forEach(btn=>{
                btn.addEventListener('click', async(e)=>{
                e.preventDefault();
                const senderId = auth.currentUser.uid;
                const receiverId = e.currentTarget.getAttribute("id");

                const users = await db.collection('users').where("userId", "==", receiverId).get();
                let receiverInfo = "";
                users.forEach(user =>{
                    receiverInfo = user;
                })  

                let combinedUserId = "";

                if(senderId < receiverId){
                    combinedUserId = senderId +"-"+ receiverId;
                }else{
                    combinedUserId = receiverId +"-"+ senderId;
                    }
                
                chatroom.addChatroom(receiverInfo.data(), combinedUserId);

                const sendMessageForm = document.querySelector('.sendMessageForm');
                console.log(sendMessageForm);

                sendMessageForm.addEventListener('submit', async(e)=> {
                    e.preventDefault();
                    const message = sendMessageForm['new-msg-input'].value.trim();
                    try {
                        await chatroom.addChat2(message, receiverId, combinedUserId);
                        
                        //After adding the chat, the form will be reset and closed
                        sendMessageForm.reset()

                        const doc = await db.collection('users').doc(auth.currentUser.uid).get();
                        await chatroom.addChatInRecieverChatRoom2(doc.data(), receiverId, combinedUserId);
                    
                    } catch (error) {
                        console.log(error.message)
                    }
                });
            })
            })  
    
            }else{
            console.log("Please sign in to send messages");
        }
        });
}
    


export const getLikedPosts = async(propertyArray) =>{
    const user = await db.collection('users').doc(auth.currentUser.uid).get();
    const likeBtns = document.querySelectorAll('.bi-heart');

    likeBtns.forEach(btn=>{
        //Push each button id to check if user liked that post and turn button red
        let likeBtnsArray = [];
        likeBtnsArray.push(btn.getAttribute("id"));

        propertyArray.forEach(property=>{
            const propertyId = property.data().propertyDetails.propertyId;
            if(user.data().likedPosts.includes(propertyId)){
                if(btn.getAttribute('id') === propertyId){ 
                    btn.classList.add('bi-heartClicked');
                }
            }else{
            //    btn.classList.remove('bi-heartClicked'); 
            }
        })


        btn.addEventListener('click', (e)=>{
            console.log(btn, e.target.getAttribute('id'));
            btn.classList.toggle('bi-heartClicked');
            const postId = e.target.getAttribute('id');
            if(user.data().likedPosts.includes(postId)){
                db.collection("users").doc(auth.currentUser.uid).update({
                    likedPosts: firebase.firestore.FieldValue.arrayRemove(postId)
                });
            }else{
                db.collection("users").doc(auth.currentUser.uid).update({
                    likedPosts: firebase.firestore.FieldValue.arrayUnion(postId)
                });
            }
        })
    })
}