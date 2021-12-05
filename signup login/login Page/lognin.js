let email = document.getElementById("email");
let password = document.getElementById("password");
let logIn = document.getElementById("logIn");
let emailIconError = document.querySelector("#emailError .fontawesome__error");
let emailTextError = document.querySelector("#emailError .text__error");
let passwordIconError = document.querySelector(
  "#passwordError .fontawesome__error"
);
let passwordTextError = document.querySelector("#passwordError .text__error");

let emailbool;
let passwordbool;

let auth = firebase.auth();
let db = firebase.firestore();
let storage = firebase.storage();

email.onclick = function () {
  emailbool = true;
  passwordbool = false;
};
password.onclick = function () {
  emailbool = false;
  passwordbool = true;
};

function onblorr() {
  emailbool = false;
  passwordbool = false;
}
email.onblur = onblorr();
password.onblur = onblorr();

let accountMode = "restaurantUsers";
function toNavigate(elem, name) {
  var elementTomove = elem.parentNode.children[0];
  
  if (name == "restaurantUsers") {
    accountMode = "restaurantUsers";
    elementTomove.style.cssText = "right:50%;";
  } else if (name == "customers") {
    accountMode = "customers";
    elementTomove.style.cssText = "right:0;";
  }
}
function capsLockOn() {
  if (emailbool) {
    checkEmail();
  } else if (passwordbool) {
    checkPassword();
  }
  promiseofsubmitbutton();
}

function checkEmail() {
  if (email.value.length > 5) {
    return true;
  }
}
function checkPassword() {
  if (password.value.length > 5) {
    return true;
  }
}
function promiseofsubmitbutton() {
  let b = checkEmail();
  let c = checkPassword();
  if (b && c) {
    logIn.setAttribute("onclick", "createUser(this)");
    logIn.style.opacity = 1;
    logIn.style.cursor = "pointer";
  } else {
    logIn.removeAttribute("onclick");
    logIn.style.cursor = "auto";
    logIn.style.opacity = 0.3;
  }
}
function createUser() {
  logIn.removeAttribute("onclick");
  logIn.style.opacity = 0.3;
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      var user = userCredential.user;
      
      var docRef = db.collection(accountMode).doc(user.uid);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            if(doc.data().account === 'restaurant'){
              window.location = '../../Dashboard/Restaurent dash/dashboard.html'
            }
            if(doc.data().account === 'customer'){
              window.location = '../../Dashboard/Customer Dash/customer.html'
            }

          } else {
            emailTextError.innerHTML = "Type correct email";
            emailIconError.className = "fa fa-exclamation-circle dangerColor";
            passwordTextError.innerHTML = "";
            passwordIconError.className = "";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (
        errorMessage ===
        "There is no user record corresponding to this identifier. The user may have been deleted."
      ) {
        emailTextError.innerHTML = "Type correct email";
        emailIconError.className = "fa fa-exclamation-circle dangerColor";
        passwordTextError.innerHTML = "";
        passwordIconError.className = "";
      }
      if (
        errorMessage ===
        "The password is invalid or the user does not have a password."
      ) {
        emailTextError.innerHTML = "";
        emailIconError.className = "";
        passwordTextError.innerHTML = "Wrong password";
        passwordIconError.className = "fa fa-exclamation-circle dangerColor";
      }
      console.log(error);
      console.log(error.message);
    });
}
function tocreateAcc() {
  window.location = "../Your account role/role.html";
}
