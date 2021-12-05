let userName = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let country = document.getElementById("country");
let city = document.getElementById("city");
let submitBtn = document.getElementById("submitBtn");
let errorPlacement = document.getElementById("errorplacement");

let matchPassTextError = document.querySelector("#matchPassError .text__error");

let emailIconError = document.querySelector(
  "#emailError .fontawesome__error i"
);
let emailTextError = document.querySelector("#emailError .text__error");

let usernamebool;
let emailbool;
let passwordbool;
let countrybool;
let citybool;
let capsbool;

let auth = firebase.auth();
let db = firebase.firestore();
let storage = firebase.storage();

email.onclick = function () {
  emailbool = true;
  passwordbool = false;
  usernamebool = false;
  countrybool = false;
  citybool = false;
};
password.onclick = function () {
  passwordbool = true;
  emailbool = false;
  usernamebool = false;
  countrybool = false;
  citybool = false;
};

userName.onclick = function () {
  usernamebool = true;
  emailbool = false;
  passwordbool = false;
  countrybool = false;
  citybool = false;
};
let countryvalue;

country.onchange = async function () {
  countrybool = true;
  emailbool = false;
  passwordbool = false;
  usernamebool = false;
  citybool = false;
  await checkCountry();
  promiseofsubmitbutton();
};
city.onchange = async function () {
  citybool = true;
  countrybool = false;
  emailbool = false;
  passwordbool = false;
  usernamebool = false;
  await checkCity();
  promiseofsubmitbutton();
};

function onblorr() {
  emailbool = false;
  passwordbool = false;
  usernamebool = false;
}
userName.onblur = onblorr();
email.onblur = onblorr();
passwordbool.onblur = onblorr();

function capsLockOn(keyprop) {
  if (keyprop.getModifierState("CapsLock")) {
    capsbool = true;
  } else if (keyprop.getModifierState("CapsLock") == false) {
    capsbool = false;
  }

  if (usernamebool) {
    checkUsername();
  } else if (emailbool) {
    checkEmail();
  } else if (passwordbool) {
    checkPassword();
  } else if (countrybool) {
    checkCountry();
  } else if (citybool) {
    checkCity();
  }
  promiseofsubmitbutton();
}

function checkUsername() {
  let usernameIconError = document.querySelector(
    "#usernameError .fontawesome__error i"
  );
  let usernameTextError = document.querySelector("#usernameError .text__error");
  
  if (userName.value < 1) {
    usernameIconError.className = "";
    usernameTextError.innerText = "";
  }
  for (var i in userName.value) {
    
    if (userName.value.length < 6 && userName.value.length > 2) {
      usernameIconError.className = "fa fa-exclamation-circle dangerColor";
      usernameTextError.innerText = "Name is too short";
    } else if (userName.value.length >= 6) {
      usernameIconError.className = "fa fa-check-circle success";
      usernameTextError.innerText = "";
      return true;
    }
  }
}

function checkEmail() {
  let emailIconError = document.querySelector(
    "#emailError .fontawesome__error i"
  );
  let emailTextError = document.querySelector("#emailError .text__error");
  if (email.value < 1) {
    emailIconError.className = "";
    emailTextError.innerText = "";
  }
  for (var i in email.value) {
    if (capsbool == false) {
      emailIconError.className = "";
      emailTextError.innerText = "";
    }

    if (capsbool) {
      emailIconError.className = "fa fa-exclamation-circle dangerColor";
      emailTextError.innerText = "Caps Lock on";
    } else if (email.value.indexOf("@") == -1 && email.value.length > 3) {
      emailIconError.className = "fa fa-exclamation-circle dangerColor";
      emailTextError.innerText = "Email is invalid";
    } else if (email.value.indexOf(".") == -1 && email.value.length > 3) {
      emailIconError.className = "fa fa-exclamation-circle dangerColor";
      emailTextError.innerText = 'Email should have "."';
    } else if (email.value.length >= 5) {
      emailIconError.className = "fa fa-check-circle success";
      emailTextError.innerText = "";
      return true;
    }
  }
}
function checkPassword() {
  let passwordIconError = document.querySelector(
    "#passwordError .fontawesome__error i"
  );

  let passwordTextError = document.querySelector("#passwordError .text__error");
  if (password.value.length < 1) {
    passwordIconError.className = "";
    passwordTextError.innerText = "";
  }

  if (password.value.length < 6 && password.value.length > 1) {
    passwordIconError.className = "fa fa-exclamation-circle dangerColor";
    passwordTextError.innerText = "Password too weak";
  } else if (password.value.length >= 6) {
    passwordIconError.className = "fa fa-check-circle success";
    passwordTextError.innerText = "";
    return true;
  }
}
function checkCountry() {
  let countryIconError = document.querySelector(
    "#countryError .fontawesome__error i"
  );
  if (country.value == "Pakistan") {
    countryIconError.className = "fa fa-check-circle success";
    return true;
  }
}
function checkCity() {
  let cityIconError = document.querySelector(
    "#cityError .fontawesome__error i"
  );
  if (city.value == "Karachi" || city.value == "Lahore") {
    cityIconError.className = "fa fa-check-circle success";

    return true;
  }
}

function promiseofsubmitbutton() {
  let a = checkUsername();
  let b = checkEmail();
  let c = checkPassword();
  let d = checkCountry();
  let e = checkCity();
  if (a && b && c && d && e) {
    submitBtn.setAttribute("onclick", "createUser(this)");
    submitBtn.style.opacity = 1;
    submitBtn.style.cursor = 'pointer';

  } else {
    submitBtn.removeAttribute("onclick");
    submitBtn.style.opacity = 0.3;
    submitBtn.style.cursor = 'auto';
    
  }
}

async function createUser(element) {
  submitBtn.removeAttribute("onclick");
  submitBtn.style.opacity = 0.3;
  try {
    let userauth = await auth.createUserWithEmailAndPassword(
      email.value,
      password.value
    );
    var uid = userauth.user.uid;
    var mode = localStorage.getItem("accountMode");
    await db.collection("restaurantUsers").doc(uid)
        .set({
         email:email.value,
         userId:uid,
         userName:userName.value,
         country:country.value,
         city:city.value,
         account:mode
        })
    window.location = '../../Dashboard/Restaurent dash/dashboard.html'
  } catch (err) {
    if (err.message === "The email address is badly formatted.") {
      emailIconError.className = "fa fa-exclamation-circle dangerColor";
      emailTextError.innerText = "Invalid Email";
    } else if (
      err.message === "The email address is already in use by another account."
    ) {
      emailIconError.className = "fa fa-exclamation-circle dangerColor";
      emailTextError.innerText = "This Email is already in use.";
    }
  }
}
