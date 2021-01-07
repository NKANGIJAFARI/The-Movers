// import firebase from './main';
import {db, auth} from './firebaseConfig'

//Reference to all global variables

const chatWrapper = document.querySelector('.chat-wrapper');
const LogInBtn = document.querySelector('#loginBtn');
const signInSignUpWrapper = document.querySelector(".signInSignUpWrapper");
const toShowWhenLoggedIn = document.querySelectorAll(".loggedIn");
const toShowWhenLoggedOut = document.querySelectorAll(".loggedOut");  
const logOutBtns = document.querySelectorAll(".logOutBtn");
const navLinks = document.querySelectorAll(".navbar__item");


// Distiguish what to show owners and clients
const ownersElements = document.querySelectorAll('.owner');
const clientsElements = document.querySelectorAll('.client');
const OnlyOfflineElements = document.querySelectorAll('.onlyOffline');

    //Before signing in/Up, check if user is already logged In.
auth.onAuthStateChanged(user=>{
    if(user){

        navLinks.forEach(link=>{
            if(link.classList.contains('activeUser')){
                link.style.display = "block";
            }
        })

    distiguishUserUI();
 

    console.log('User logged in as:', auth.currentUser.email)
        
   //Below is the code for the logout in all pages
    logOutBtns.forEach(button=>{
        button.addEventListener('click', (e)=>{
            e.preventDefault();
            auth.signOut().then(()=>{
                window.location = "index.html";
            }).catch(err=> console.log(err))
        });
    })
    }else{

        //Specify what to show whenever a user is not loddeg in
        navLinks.forEach(link=>{
            if(link.classList.contains('inActiveUser')){
                link.style.display = "block";
            }
        })

        OnlyOfflineElements.forEach(elem =>{
            elem.style.display ="block"
        })
    }
});




const distiguishUserUI = async() =>{
    const user = await db.collection('users').doc(auth.currentUser.uid).get();
    //Give User data to the getProfile Pic Function to load profile 
    //Pics on all pages
    getProfilePic(user);

    if(user.data().RegisterAs === "owner"){
        ownersElements.forEach(elem =>{
            elem.style.display = "block";
        });
    }else if(user.data().RegisterAs === "client"){
        clientsElements.forEach(elem =>{
            elem.style.display = "block"
        });

        // Disable functionality of posting if user isn't registered as owner
        
        // Check if a client user try to go to the post property page
        if(window.location.pathname === "/postProperty.html" || window.location.pathname === "/editPost.html" ){
            window.location = 'index.html'
        }else{
            console.log("not post")
        }
    }

}

//A function to display profile pic on all pages
const getProfilePic = (user)=>{
    const profilePicImg = document.querySelectorAll('.profilePicImg');
    profilePicImg.forEach(profile =>{
        const imgUrl = user.data().profilePic;
        profile.src = imgUrl;
    })
    };








