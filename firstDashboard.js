function goOnlogin() {
  window.location = "signup login/login Page/login.html";
}

async function loadDom() {
  await curUser();
  
}
loadDom();
function curUser() {
  let currentUser = firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      var restaurantRef = await firebase
        .firestore()
        .collection("restaurantUsers")
        .doc(user.uid);
      restaurantRef.get().then((doc) => {
        if (doc.exists) {
          window.location = "Dashboard/Restaurent dash/dashboard.html";
        } else {
          window.location = "Dashboard/Customer Dash/customer.html";
        }
      });
    } else {
      var rowTOBeShown = document.getElementById("row");
      await firebase
        .firestore()
        .collection("items")
        .orderBy("city")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let { postPhoto, itemName, postId } = doc.data();
            rowTOBeShown.innerHTML =
              rowTOBeShown.innerHTML +
              `
            <div
          class="mt-3 p-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6 widthformedia"
          id="${postId}"
        >
          <div class="cardForItem p-4">
            <div class="forImage " id='${postPhoto}'></div>
            <div class="remaining-space">
                <div class="forItemName mt-4"><h4>${itemName}</h4></div>
                <div class="forPrice"><h5>Rs. $$$</h5></div>
                <div class="forOrderBtn mt-3"><button onclick="goOnlogin()">Order Now</button></div>
            </di>
          </div>
        </div>
      </div>
            `;
            let imgSource = document.getElementById(postPhoto);
            imgSource.style.backgroundImage = `url('${postPhoto}')`;
            let lodaingSpinner = document.getElementById("loading");
            lodaingSpinner.style.display = "none";
            domAndRowtobeshown();
          });
        });
    }
  });
}

function domAndRowtobeshown() {
  let header = document.querySelector("header");
  let main = document.querySelector("main");
  header.style.display = "block";
  main.style.display = "block";
}
function navigateLine(elem) {
  console.log(elem);
  let getAnchortag = document.querySelectorAll(".navigate a");
  for (var i in getAnchortag) {
    if (getAnchortag[i] === elem) {
      elem.className += " for-remember";
    }
    if (getAnchortag[i] !== elem) {
      getAnchortag[i].className = " text-decoration-none";
    }
  }
}
let bool = true;
let actionBtn = document.getElementsByClassName("forMediaActionButton")[0];

function removemenu() {
  if (bool) {
    actionBtn.style.cssText = `display: flex ;pointer-events:auto;`;
    bool = false;
  } else if (bool == false) {
    actionBtn.style.cssText = `display: none;pointer-events:none;`;
    bool = true;
  }
}
function myFunction(x) {
  if (x.matches) {
    // If media query matches
    actionBtn.style.cssText = "display:none !important;";
    bool = true;
  }
}

var x = window.matchMedia("(min-width: 768px)");

myFunction(x); // Call listener function at run time
x.addListener(myFunction); // Attach listener function on state changes
