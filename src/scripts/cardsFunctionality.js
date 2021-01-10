import { db, auth } from './firebaseConfig';
import * as firebase from 'firebase/app';
import Chatroom from '../scripts/chatScripts/chats';
// import { Button } from 'bootstrap';

export const chatFunctionality = () =>{
        // Below is a function to view properties, if the view props button is 
        //Clicked, we get its id which is the property ID both on Front
        // and backend
        const propertyDetailsBtns = document.querySelectorAll('.viewDetailsBtn');
        propertyDetailsBtns.forEach(btn =>{
            btn.addEventListener('click', (e)=>{
                e.preventDefault();
                console.log("Clicked On button", btn);
                const propertyId = e.target.parentElement.getAttribute('id');
                if(propertyId){
                    localStorage.setItem("propIdToBeViewed", propertyId);
                    window.location = "propertyDetails.html"
                }
            })
        }) 
    
        const contactBtns = document.querySelectorAll('.landLordContactBtn');
        console.log("First upload",contactBtns);

        auth.onAuthStateChanged(user=> {
            if(user){

                contactBtns.forEach(btn=>{
            
                    btn.addEventListener('click', async(e)=>{
                    e.preventDefault();
                    
                    //Class Instances
                    const chatroom = new Chatroom(auth.currentUser.uid);

                    console.log(e.target);
                    const senderId = auth.currentUser.uid;
                    const receiverId = e.currentTarget.getAttribute("id");
                        
                    if(receiverId === auth.currentUser.uid){
                        errorHandling({
                            type: "Can",
                            msg: "You cant send a message to yourself",
                            solution: "Please try contacting other landlords"
                        });
                        
                        return;
                        //throw new Error("You can't send email to your self");
                    }

                    $('#messageModal').modal('show')
                    
                    const users = await db.collection('users').where("userId", "==", receiverId).get();
                    let receiverInfo;
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
                            const doc = await db.collection('users').doc(auth.currentUser.uid).get();
                            await chatroom.addChatInRecieverChatRoom2(doc.data(), receiverId, combinedUserId);
                            
                            //Show a message sent here
                            //
    
                            //After adding the chat, the form will be reset and closed
                            sendMessageForm.reset();
                            $('#messageModal').modal('hide');
                        } catch (error) {
                            console.log(error.message);
                            
                        }
                    });
                })
                })  

            }else{
                contactBtns.forEach(btn => {
                    btn.addEventListener('click', (e)=>{
                        e.preventDefault();
                        errorHandling({
                            msg: "You're not logged In",
                            solution: "PLease Login to send a message to landlord",
                            link: "/signInPage.html", 
                            type: "Un Authorised Access"
                        })
                        return;
                    })
                })
                
                console.log("Please sign in to send messages");
            }
            });
}


export const getLikedPosts = (propertyArray) =>{
    const likeBtns = document.querySelectorAll('.bi-heart');


    //First check if a user is logged in.

        auth.onAuthStateChanged(async(user) =>{
            if(user){ 
                //Get all the buttons immediately when rendered to the DOM               
             

                //Get the user so we can access the array on their user info which holds 
                //The liked posts of that user.
                const userData = await db.collection('users').doc(auth.currentUser.uid).get();

                //Iterate throught the buttons to get their ids and comapare them to the
                //ids of posts liked by the user
                likeBtns.forEach(btn=>{
                    //Push each button id to the array check if user liked that 
                    //post and if they did, turn button red;
                    let likeBtnsArray = [];
                    likeBtnsArray.push(btn.getAttribute("id"));
            
                    propertyArray.forEach(property=>{
                        const propertyId = property.data().propertyDetails.propertyId;
                        if(userData.data().likedPosts && userData.data().likedPosts.includes(propertyId)){
                            if(btn.getAttribute('id') === propertyId){ 
                                btn.classList.add('bi-heartClicked');
                            }
                        }else{
                        //    btn.classList.remove('bi-heartClicked'); 
                        }
                    });
            
            //Add an eventListener to each button so whenever a user clicks it, they
            //like or unlike that post.
                    btn.addEventListener('click', async(e)=>{
                        btn.classList.toggle('bi-heartClicked');
                        const postId = e.target.getAttribute('id');
                    
                        //Each time a user clicks on the button, read the user info from the 
                        //Database which will have all their liked posts, if the clicked post
                        //doesnt  exists, like it else unlike it and remove it from the database.
                        
                        //This doesnt seem as the best way to do, hopefully may slow application
                        //but will be changed if better option is got.
                        const updatedUserInfo = await db.collection('users').doc(auth.currentUser.uid).get();
                        const likedPosts = updatedUserInfo.data().likedPosts;
                        
                        if(likedPosts && likedPosts.includes(postId)){
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
            }else{
                likeBtns.forEach(btn =>{
                    btn.addEventListener('click', (e)=>{
                        e.preventDefault();
                        errorHandling({
                            msg: "You're not logged In",
                            solution: "PLease Login to save posts and many more of benefit", 
                            type: "Un Authorised Access"
                         })
                    })
                })
            }
        })     
    }

const errorHandling = ({msg, solution, type, link}) =>{
    console.log('Got an error', msg)
    const errorSolution = document.querySelector('.errorSolution');
    const errorMessage = document.querySelector('.errorMessage');
    const errorModalContent = document.querySelector('.error-modal-content')
    const errorForwardLink = document.querySelector('#errorForwardLink');
    
    errorSolution.innerText = solution;
    errorMessage.innerText = msg;
    if(link){
        errorForwardLink.innerHTML = `
        <a href="${link}" class="errorForwardLink">Go to Sign In page</a>
        `
    }
 
    $('.errorHandlingModal').modal('show'); 
}