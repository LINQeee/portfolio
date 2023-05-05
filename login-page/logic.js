//* FRONT VARIABLES
const username = document.getElementById("username");
const signLink = document.getElementById("signLink");
const submit = document.getElementById("submit");
const header = document.getElementById("header");
var isErrorNoteMoving = false;
var isSuccesNoteMoving = false;

//* BACK VARIABLES
const inputData = { "username": document.getElementById("usernameInput"), "email": document.getElementById("emailInput"), "password": document.getElementById("passwordInput") };
isRegistering = false;



//* /DATA BASE SERVICES///////////////////////////////////////
//* //////////////////////////////////////////////////////////
//* //////////////////////////////////////////////////////////
function createCookie(cookieName, cookieValue, expireTime){
    var expires = (new Date(Date.now()+ expireTime)).toUTCString();
    document.cookie = cookieName+'='+cookieValue+'; expires=' + expires + ';path=/';
    console.log("cookie created");
}

//*ON CLICK SUBMIT BUTTON//////////////
function submitForm() {
    if(isRegistering && inputData["email"].getAttribute("value").length != 0 && inputData["password"].getAttribute("value").length != 0 && inputData["username"].getAttribute("value").length != 0) {
        registerUser();//*if registering
    }
    else if(inputData["email"].getAttribute("value").length != 0 && inputData["password"].getAttribute("value").length != 0){
        checkIsPasswordCorrect();//* if loginning
    }
}

function registerUser(){
    fetch('http://192.168.1.98:8090/user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"email": inputData["email"].getAttribute("value"), "password": inputData["password"].getAttribute("value"), "username": inputData["username"].getAttribute("value")})
    })
        .then(response => {
            if(response["status"] == 200){
                sendEmailAndCode();
                showNotification("succes", "Your account has been created, now authorise it with a verification code");
                response.text().then(data => {console.log(data)});
            }
            else if(response["status"] == 500){
            response.json().then(data => { 
                if(data["type"] == "UNEXPECTED" && data["message"] == "could not execute statement; SQL [n/a]; constraint [user.email]"){
                    showNotification("error", "This email is already in use");
                    console.log(data["message"]);
                }
            });
            }
            else{
                showNotification("error", "An unexpected error has occurred");
            }
        }).catch(function () {
            showNotification("error", "We couldn't create an account");
    });
}

function checkIsPasswordCorrect(){
    fetch('http://192.168.1.98:8090/check-user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"email": inputData["email"].getAttribute("value"), "password": inputData["password"].getAttribute("value")})
    })
        .then(response => {
            if(response["status"] == 200){
                sendEmailAndCode();
            }
            else if(response["status"] == 500){
                response.json().then(data => {
                    if(data["type"] == "UNEXPECTED" && data["message"] == "User not found"){
                        showNotification("error", "The email is wrong, create a new account");
                    }
                    else if(data["type"] == "UNEXPECTED" && data["message"] == "Bad password"){
                        showNotification("error", "The password is wrong, try again");
                    }
                })
            }
            else{
                showNotification("error", "An unexpected error has occurred");
            }
        })
        .catch(function () {
            showNotification("error", "We couldn't check is password or email match, try again later");
    });
}


function verificationCodeCheck(){
    fetch('http://192.168.1.98:8090/check-code', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"code": document.getElementById("verificationCode").getAttribute("value"), "email": inputData["email"].getAttribute("value")})
    })
        .then(response => {
            if(response["status"] == 200){
                response.text().then(data => {console.log(data)});
                var expireTime;
                if(document.getElementById("remember").checked)
                expireTime = 86400*4000;
                else expireTime = 100000;
                emailResponse = getUserByEmail(inputData["email"].getAttribute("value")).then(userData => {
                    createCookie("username", userData["username"], expireTime);
                    createCookie("email", userData["email"], expireTime);
                    createCookie("password", userData["password"], expireTime);
                    window.history.go(-1);
                });
                if(emailResponse["status"] == 200){
                    emailResponse.then(userData => {
                        createCookie("username", userData["username"], expireTime);
                        createCookie("email", userData["email"], expireTime);
                        createCookie("password", userData["password"], expireTime);
                        window.history.go(-1);
                    });
                }
                else if(emailResponse["status"] == 500){
                    emailResponse.then(errorData => {
                        if(errorData["message"] == "No value present"){
                            showNotification("error", "It seems that an account with this email doesn't exist");
                        }
                    });
                }
                else{
                    showNotification("error", "An unexpected error has occurred");
                }
                
            }
            else if(response["status"] == 500){
                response.json().then(data => { 
                    if(data["type"] == "UNEXPECTED" && data["message"] == "Bad code"){
                        showNotification("error", "The code doesn't match");
                        console.log(data["message"]);
                    }
                    else if(data["type"] == "UNEXPECTED" && data["message"] == "No value present"){
                        showNotification("error", "An unexpected error has occurred");
                        console.log(data["message"]);
                    }
                });
            }
            
        }).catch(function (error) {
            console.log(error);
            showNotification("error", "We couldn't compare code, try again later");
    });
}


function sendEmailAndCode(){
    fetch('http://192.168.1.98:8090/send-code', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: inputData["email"].getAttribute("value")
    })
        .then(response => {
            if(response["status"] == 200){
                showEmailWindow();
            }
            else if(response["status"] == 500){
                response.json().then(data => { 
                    if(data["type"] == "UNEXPECTED"){
                        showNotification("error", "We couldn't send an email, cause internal server error");
                        console.log(data["message"]);
                    }
                });
            }
            else{
                showNotification("error", "An unexpected error has occurred");
            }
        }).catch(function () {
            showNotification("error", "We couldn't send a request to server, try again later");
        });
}

async function getUserByEmail(email){
    email = "adrianvved@gmail.com";
    return fetch('http://192.168.1.98:8090/user/email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: email
    })
        .then(response => {
            if(response["status"] == 200){
                return response.json().then(data => {
                    return data;
                })
            }
            else if(response["status"] == 500){
                response.json().then(data => { 
                    console.log(data["message"]);
                    return data;
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
}


//* WAITING FOR MILLISECONDS////////////////
const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};


//* /FRONTEND SERVICES///////////////////////////////////////
//* //////////////////////////////////////////////////////////
//* //////////////////////////////////////////////////////////




function showEmailWindow(){
    let inputs = document.getElementsByTagName("input");
    for(let input of inputs){
        input.setAttribute("tabindex", "-1");
    }
    document.getElementById("emailBox").style.scale = "1";
    document.getElementById("emailIcon").style.animation = "1s ease-in 1s forwards emailFlyOut";
    document.getElementById("truck").style.animation = "3s ease truckDrive";
}


//*FOR SWITCH BUTTON////////////////////////////////////////////////////
function switchToRegister() {
    document.getElementById("email").style.marginTop = "70px";
    username.style.marginTop = "40px";
    username.style.transform = "scaleY(1)";
    document.getElementById("signAdvice").innerHTML = "Already have an account?";
    signLink.innerHTML = "Sign In";
    signLink.setAttribute("onclick", "switchToSigning()");
    submit.innerHTML = "register";

    header.innerHTML = "Create Account";
    isRegistering = true;
}

function switchToSigning() {
    document.getElementById("email").style.marginTop = "0px";
    username.style.marginTop = "0px";
    username.style.transform = "scaleY(0)";
    document.getElementById("signAdvice").innerHTML = "Doesn't have an account yet?";
    signLink.innerHTML = "Sign Up";
    signLink.setAttribute("onclick", "switchToRegister()");

    inputData["username"].value = '';
    inputData["username"].setAttribute("value", "");;

    submit.innerHTML = "login";
    header.innerHTML = "Login to Your Account";
    isRegistering = false;
}
//* ///////////////////////////////////////////////////////////////////////


async function showNotification(noteType, noteMessage) {
    let noteId;
    let coolDownId;
    let noteHeader;
    if(noteType.toLowerCase() == "error" && isErrorNoteMoving == false){
        noteId = "errorNote";
        coolDownId = "errorCooldown";
        noteHeader = "Oops, something went wrong!";
        isErrorNoteMoving = true;
    }
    else if(noteType.toLowerCase() == "succes" && isSuccesNoteMoving == false){
        noteId = "succesNote";
        coolDownId = "succesCooldown";
        noteHeader = "Succes!";
        isSuccesNoteMoving = true;
    }
    else return;
    var note = document.getElementById(noteId);
    var cooldown = document.getElementById(coolDownId);
    note.querySelector(".noteHeader").innerHTML = noteHeader;
    note.querySelector(".noteMessage").innerHTML = noteMessage;
    note.style.display = "flex";
    note.style.animation = "1s ease forwards noteMoveUp";
    cooldown.style.animation = "3s linear 0.5s reverse forwards cooldownMove";
    await sleep(3900);
    note.style.animation = "1s ease forwards noteMoveDown";
    await sleep(1000);
    cooldown.style.width = "300px";
    note.style.display = "none";
    if (noteId == "errorNote") isErrorNoteMoving = false;
    else isSuccesNoteMoving = false;
}

//*save input value in attribute////////////////////////////////////////////////
function setValue(id, isPassowrd) {
    var newValue;
    var element = document.getElementById(id);
    var inputValue = element.value;

    if (isPassowrd) {
        if (inputValue.length > element.getAttribute("value").length) {
            newValue = element.getAttribute("value") + inputValue[inputValue.length - 1];
        }
        else {
            newValue = element.getAttribute("value").slice(0, element.getAttribute("value").length - 1);
        }
        var newInputValue = newValue;
        element.setAttribute("value", newValue);

        for (let index = 0; index < element.getAttribute("value").length; index++) {
            newInputValue = setCharAt(newInputValue, index, "●");

        }
        element.value = newInputValue;
    }
    else {
        element.setAttribute("value", inputValue);
    }


}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}
//* //////////////////////////////////////////////////////////////////////////////////////
