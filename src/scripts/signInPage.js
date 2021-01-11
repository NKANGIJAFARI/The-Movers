import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
// import '../styles/signInPage.css';

import '../Sass styles/main.scss'

import firebase from './firebaseConfig';
import {db, auth} from './firebaseConfig';

const signUpForm = document.querySelector(".signUpForm");
const signInForm = document.querySelector(".signInForm");

    //A function to enable you signUp in the application
    signUpForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const email = signUpForm['signup-email'].value;
        const password = signUpForm['signup-password'].value;
       // const confirmPassword = signUpForm['confirm-password'].value;


       auth.createUserWithEmailAndPassword(email, password).then((credentials)=> {
        return db.collection('users').doc(credentials.user.uid).set({
            Name: signUpForm['name'].value,
            PhoneNumber: signUpForm['signup-phoneNumber'].value.trim(),
            RegisterAs: signUpForm['registerAs'].value,
            email: email,
            userId : credentials.user.uid,
            gender: signUpForm['gender'].value,
            profilePic: signUpForm['gender'].value === "male" ? "https://firebasestorage.googleapis.com/v0/b/the-movers-2020.appspot.com/o/avatars%2Favatar__male.png?alt=media&token=da3654de-bd63-436a-b2f0-9cc57749aaec" : "https://firebasestorage.googleapis.com/v0/b/the-movers-2020.appspot.com/o/avatars%2Favatar__female.jpg?alt=media&token=2eb8fc0f-386c-4cbe-8a2c-dbeabf19e9db",
        });
      }).then(()=>{
        signUpForm.reset();
        window.location = "index.html";
        //popup a message to upload a picture
      }).catch(err=> console.log(err, err.message));
    });

        //Below is the signIn
        signInForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const email = signInForm["signInEmail"].value;
            const password = signInForm["signInPassword"].value;
            auth.signInWithEmailAndPassword(email, password).then(()=>{
                signInForm.reset();
                window.location = "index.html";
            }).catch(err=> console.log(err));
        });
    

// const signUpButton = document.getElementById('signUp');
// const signInButton = document.getElementById('signIn');

// signUpButton.addEventListener('click', () => {
//     signUpWrapper.classList.add("right-panel-active");
//     //signUpWrapper.style.width ="75%";
// });

// signInButton.addEventListener('click', () => {
//     signUpWrapper.classList.remove("right-panel-active");
//     //signUpWrapper.style.width = "60%"
//     if (window.screen.width < 1024) {
//         signUpWrapper.style.width = "70%"
//       }
// });


const logInRegisterWrapper = document.querySelector('.logInRegisterWrapper');
const toggleSignInUpBtns = document.querySelectorAll(".toggleSignUpSigInBtn");
const toSignUp = document.querySelector('.pageButton--1');
const toSignIn = document.querySelector(".pageButton--2")

toggleSignInUpBtns.forEach(btn =>{
    btn.addEventListener("click", (e)=>{
        e.preventDefault();

        const btnType = e.currentTarget.getAttribute("id");


        if(btnType === "signUp"){
            logInRegisterWrapper.classList.add("right-panel-active");
            if(!toSignIn.classList.contains("active")){
                toSignIn.classList.add("active");
                toSignUp.classList.remove("active");
            }else{return}
            
        }else if(btnType === "signIn"){
            logInRegisterWrapper.classList.remove("right-panel-active");
            if(!toSignUp.classList.contains("active")){
                toSignUp.classList.add("active");
                toSignIn.classList.remove("active");
            }else{return}
        }
    })
})