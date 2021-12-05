let auth = firebase.auth();
let db = firebase.firestore();
let storage = firebase.storage();

let id;
function getAccountMode(element){
    let restaurant = document.getElementById('restaurant');
    let customer = document.getElementById('customer');
    let nextDiv = document.querySelector('.next__div button')
    if(restaurant.id == element.id){
        element.style.opacity = 1
        customer.style.opacity = 0.3
        nextDiv.style.opacity = 1
        id = element.id
        
        
    }
    if(customer.id == element.id){
        element.style.opacity = 1
        restaurant.style.opacity = 0.3
        nextDiv.style.opacity = 1
        id = element.id
        
    }
}
function next(){
    
    localStorage.setItem('accountMode',id)
    if(id == 'restaurant'){
        window.location = '../Restaurant login page/restaurant.html'
    }
    if(id == 'customer'){
        window.location = '../Customer login Page/customer.html'

    }

    
}
    