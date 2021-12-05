let auth = firebase.auth();
let db = firebase.firestore();
let storage = firebase.storage();
let userName = document.getElementById('userName');
let itemName = document.getElementById("name");
let price = document.getElementById("price");
let maindiv = document.getElementById('main');
let btntoremove = document.getElementById("addbtntoremove");
let imageShowdiv = document.getElementById("imageshowhere");
let imageFile = document.getElementById("Imagefile");

let itemNmebool;
let pricebool;
let capsbool;

var userdata
var id;
function goback(){
    window.location = '../Restaurent dash/dashboard.html'
}
function userofthispage(){
    auth.onAuthStateChanged((user) => {
        if (user) {
            uid = user.uid;
            
            var docRef = db.collection("restaurantUsers").doc(uid);
            docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    userdata = doc.data()
                    userName.innerText = doc.data().userName;
                    maindiv.style.display = 'flex'
          } else {
            document.body.style.cssText = `text-align:center;font-size:35px;`
            document.body.innerText = 'User Not Found'
            
          }
        })
    } 
  });
}
userofthispage()


itemName.onclick = function () {
  itemNmebool = true;
  pricebool = false;
};
price.onclick = function () {
    pricebool = true;
    itemNmebool = false;

};

function capsLockOn(keyprop) {
  if (keyprop.getModifierState("CapsLock")) {
    capsbool = true;
  } else if (keyprop.getModifierState("CapsLock") == false) {
    capsbool = false;
  }

  if (pricebool) {
      checkPrice() 
    }
  if (itemNmebool) {
      checkItemName()
  }
  promiseofsubmitbutton();
}

function checkItemName() {
    

  let itemNameIconError = document.querySelector(
    "#itemNameError .fontawesome__error i"
  );
  let itemNameTextError = document.querySelector("#itemNameError .text__error");
  if(isNaN(itemName.value)){
      itemNameTextError.innerText = "";
      itemNameIconError.className = "";

  }

  for (var i in itemName.value) {
      if(isNaN(itemName.value[i]) == false && itemName.value !== ''){
          itemNameTextError.innerText = "Dont type Numbers";
          itemNameIconError.className = "fa fa-exclamation-circle dangerColor";
        }else if(itemName.value.length < 4){
            itemNameTextError.innerText = "Item name too short";
            itemNameIconError.className = "fa fa-exclamation-circle dangerColor";
        }else if(isNaN(itemName.value)){
            itemNameTextError.innerText = "";
            itemNameIconError.className = "fa fa-check-circle success";
            return true
        }

    }


}
function checkPrice() {
  let priceIconError = document.querySelector(
    "#priceError .fontawesome__error i"
  );
  let priceTextError = document.querySelector("#priceError .text__error");

  if (isNaN(price.value) == false) {

    priceTextError.innerText = "";
    priceIconError.className = "";
  }
  
    if (isNaN(price.value)) {
      priceTextError.innerText = "Please Type Price";
      priceIconError.className = "fa fa-exclamation-circle dangerColor";
    } else if (
      isNaN(price.value) == false
      &&
      price.value.length > 1) {
      priceTextError.innerText = "";
      priceIconError.className = "fa fa-check-circle success";
      return true;
    }
  
}
let imagebool
function checkimage(){
    return imagebool
}

function promiseofsubmitbutton() {
 let a = checkItemName()
 let b = checkPrice()
 let c = checkimage()
    if(a && b && c){
        submitBtn.setAttribute("onclick", "sendPost(this)");
    submitBtn.style.opacity = 1;
    submitBtn.style.cursor = 'pointer';
    }else {
        submitBtn.removeAttribute("onclick");
        submitBtn.style.opacity = 0.3;
        submitBtn.style.cursor = 'auto';
      }

}
let downloadableUrl;
async function getFoodImage() {
  id = db.collection('faizan').doc().id
  var imageName = imageFile.files[0];
  var imageRef = storage.ref('itemImages').child(`${id}`);
  await imageRef.put(imageName);
  await imageRef.getDownloadURL().then((downloadURL) => {
    downloadableUrl = downloadURL  
    btntoremove.style.display = "none";
    imageShowdiv.style.cssText = `display:block;background-image:url('${downloadURL}')`;
    imagebool = true
    promiseofsubmitbutton()
});
}
function sendPost(element){
        submitBtn.removeAttribute("onclick");
        submitBtn.style.opacity = 0.3;
        submitBtn.style.cursor = 'auto';
        
        db.collection("items").doc(id).set({
            userId : userdata.userId,
            postId : id,
            userName : userdata.userName,
            account : userdata.account,
            postPhoto : downloadableUrl,
            price : price.value,
            itemName : itemName.value,
            city : userdata.city
        })
        .then(() => {
            window.location = '../Restaurent dash/dashboard.html'

        })
        

}