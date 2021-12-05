let auth = firebase.auth();
let db = firebase.firestore();
let storage = firebase.storage();
let showUsername = document.getElementById("showUsername");
let showEmail = document.getElementById("showEmail");
let row = document.getElementById("row");
let pendingLsit = document.getElementById("pendinglist");
let deliveredList = document.getElementById("deliveredList")

function navigateLine(elem, arg) {
  let getAnchortag = document.querySelectorAll(".navigate a");
  const showitemGrandParent = document.getElementById("showItemGrandParent");
  const showOrderGrandParent = document.getElementById("orderPage");

  if (arg === "order") {
    showitemGrandParent.style.display = "none";
    showOrderGrandParent.style.display = "block";
  }
  if (arg === "home") {
    showitemGrandParent.style.display = "block";
    showOrderGrandParent.style.display = "none";
  }
  for (var i in getAnchortag) {
    if (getAnchortag[i] === elem) {
      elem.className += " for-remember";
    }
    if (getAnchortag[i] !== elem) {
      getAnchortag[i].className = " text-decoration-none";
    }
  }
}

function topPostitem() {
  window.location = "../add new item resaturant/postItem.html";
}

let bool = true;
function hidePanel() {
  let panel = document.getElementsByClassName("profilePanel")[0];
  if (bool) {
    panel.style.display = "block";
    bool = false;
  } else if (bool == false) {
    panel.style.display = "none";
    bool = true;
  }
}

let uid;
function connect() {
  auth.onAuthStateChanged((user) => {
    if (user) {
       uid = user.uid;
       var docRef = db.collection("restaurantUsers").doc(uid);
       docRef.get().then((doc) => {
         if (doc.exists) {
           let { userName, email, city } = doc.data();
          console.log(userName,email,city)
           /// For SideMenu Profile Panel
           profilePanel(userName, email);
 
           /// For items in Row
           getitemsFromDatabase(city);
 
           ///for Pending or Cooking Orders
           getPendingItems();
 
           // for Delivered orders
           getDeliveredItems();
         }
       });
        
      
    } else if (!user) {
      window.location = "../../index.html";
    }
  });
}
connect();


function profilePanel(userName, email) {
  showEmail.innerText = email;
  showUsername.innerText = userName;
}

function getitemsFromDatabase(city) {
  db.collection("items")
    .where("userId", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let { itemName, postId, price, postPhoto, userId } = doc.data();
        row.innerHTML = `${row.innerHTML}
            <div class="mt-3 p-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6 widthformedia" id="${userId}">
            <div class="cardForItem p-4">
              <div class="forImage " id="${postPhoto}">
              </div>
              <div class="remaining-space">
                <div class="forItemName mt-4"><h4>${itemName}</h4>
                </div>
                <div class="forPrice"><h5>Rs.${price}</h5>
                </div>
              </div>
            </div>
          </div>
            `;
        let imgSource = document.getElementById(postPhoto);
        imgSource.style.backgroundImage = `url('${postPhoto}')`;
      });
    });
}


function getPendingItems() {
  db.collection("orders")
    .where("restauratId", "==", uid)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let { customerId, restauratId, postId, orderId, deliveryInfo } =
          change.doc.data();

        db.collection("items")
          .where("postId", "==", postId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let { itemName, postId, price, postPhoto, userId } = doc.data();
              if (change.type === "added") {
                if (deliveryInfo === "cooking") {
                  pendingLsit.innerHTML =
                    pendingLsit.innerHTML +
                    `
              <li class="px-3 py-2" id="${orderId}">
              <div class="d-flex f">
                <div class="forImgOfitem"><img src="${postPhoto}" alt=""></div>
                <div class="ms-3  text-break">
                  <h5>${itemName}</h5>
                  <h6>Rs. ${price}</h6>
                </div>
                <div class="ms-auto fst-italic d-flex justify-content-end align-items-center">
                <div class="forOrderBtn mt-3"><button onclick="deliveryDone(this)" id="${postId}">Done</button>
                </div>
              </div>
            </li>`;
                }
              }

              if (change.type === "modified") {
                if (deliveryInfo === "cooking") {
                  pendingLsit.innerHTML =
                    pendingLsit.innerHTML +
                    `
              <li class="px-3 py-2" id="${orderId}">
              <div class="d-flex f">
                <div class="forImgOfitem"><img src="${postPhoto}" alt=""></div>
                <div class="ms-3  text-break">
                  <h5>${itemName}</h5>
                  <h6>Rs. ${price}</h6>
                </div>
                <div class="ms-auto fst-italic d-flex justify-content-end align-items-center">
                <div class="forOrderBtn mt-3"><button onclick="deliveryDone(this)" id="${postId}">Done</button>
                </div>
              </div>
            </li>`;
                } else {
                  let elemToDelete = document.getElementById(orderId);
                  elemToDelete.parentNode.removeChild(elemToDelete);
                }
              }
            });
          });
      });
    });
}

function deliveryDone(elem){
  let ordereditemId = elem.parentNode.parentNode.parentNode.parentNode.id;
  db.collection('orders').doc(ordereditemId).update({
    deliveryInfo: 'delivered'
})
}

function getDeliveredItems() {
  db.collection("orders")
    .where("restauratId", "==", uid)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let { customerId, restauratId, postId, orderId, deliveryInfo } =
          change.doc.data();

        db.collection("items")
          .where("postId", "==", postId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let { itemName, postId, price, postPhoto, userId } = doc.data();
              if (change.type === "added") {
                if (deliveryInfo === "delivered") {
                  console.log(postId);
                  deliveredList.innerHTML =
                    deliveredList.innerHTML +
                    `
                  <li class="px-3 py-2" id="${postId}">
                      <div class="d-flex f">
                        <div class="forImgOfitem"><img src='${postPhoto}' alt=""></div>
                        <div class="ms-3  text-break">
                          <h5>${itemName}</h5>
                          <h6>${price}</h6>
                        </div>
                        <div class="ms-auto fst-italic d-flex justify-content-end align-items-center">
                          ${deliveryInfo}
                        </div>
                      </div>
                    </li>
                  `;
                }
              }

              if (change.type === "modified") {
                if (deliveryInfo === "delivered") {
                  deliveredList.innerHTML =
                    deliveredList.innerHTML +
                    `
                   <li class="px-3 py-2" id="${postId}">
                    <div class="d-flex f">
                      <div class="forImgOfitem"><img src='${postPhoto}' alt=""></div>
                      <div class="ms-3  text-break">
                        <h5>${itemName}</h5>
                        <h6>${price}</h6>
                      </div>
                      <div class="ms-auto fst-italic d-flex justify-content-end align-items-center">
                        ${deliveryInfo}
                      </div>
                    </div>
                  </li>
                `;
                }
              }
            });
          });
      });
    });
}





function signOut() {
  auth
    .signOut()
    .then(() => {
      window.location = "../../index.html";
    })
    .catch((error) => {
      // An error happened.
    });
}
