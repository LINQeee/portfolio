const username = document.getElementById("username");
const signLink = document.getElementById("signLink");
const submit = document.getElementById("submit");
const header = document.getElementById("header");
const inputData = { "username": document.getElementById("usernameInput"), "email": document.getElementById("emailInput"), "password": document.getElementById("passwordInput") };

var isRegistering = false;

var isErrorNoteMoving = false;
var isSuccesNoteMoving = false;

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

    inputData["username"].getAttribute("value").value = '';

    submit.innerHTML = "login";
    header.innerHTML = "Login to Your Account";
    isRegistering = false;
}



function trySign() {
    if(isRegistering && inputData["email"].getAttribute("value").length != 0 && inputData["password"].getAttribute("value").length != 0 && inputData["username"].getAttribute("value").length != 0) {
        tryRegister();
    }
    else if(inputData["email"].getAttribute("value").length != 0 && inputData["password"].getAttribute("value").length != 0){
        tryLogin();
    }
}

function sendEmail(adress, subject, text){
    fetch('http://192.168.1.98:8090/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "to": adress, "subject": subject, "text": text })
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            }).catch(function (error) {
            console.log('request failed', error)
        });
}

function tryRegister(){
    sendEmail(inputData["email"].getAttribute("value"), "Here is your verefication code: " + Math.floor(100000 + Math.random() * 900000));

    fetch('http://192.168.1.98:8090/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": inputData["username"].getAttribute("value"), "email": inputData["email"].getAttribute("value"), "password": inputData["password"].getAttribute("value") })
        })
            .then(response => response.text())
            .then(data => {
                registerSucces();
            }).catch(function (error) {
            console.log('request failed', error)
            registerFail();
        });
}

function tryLogin(){
    console.log("LOGINNING");
        let params = {"email": inputData["email"].getAttribute("value")};
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');

        let url = 'http://192.168.1.98:8090/user?' + query;

        fetch(url)
        .then(response => response.json())
        .then((data) => {
            console.log('request succeeded with JSON response', data)

            if(data["email"] == inputData["email"].getAttribute("value") && data["password"] == inputData["password"].getAttribute("value")){
                loginSucces(data ,"Succes!", "Your account has been created successfuly!");
            }
            else{
                loginFail("Error!", "We couldn't create an account!");
            }
        }).catch(function (error) {
            console.log('request failed', error)
        });
}

async function registerSucces(){
    showNotification("succesNote", "succesCooldown", header, msg);
    console.log(document.getElementById("remember").checked);
    if(document.getElementById("remember").checked){
        createCookie("email", data["email"]);
        createCookie("password", data["password"]);
        createCookie("username", data["username"]);
    }
    await sleep(4900);
    window.history.go(-1);
}

async function registerFail(){

}

async function loginSucces(data, msg, header) {
    sendEmail(data["email"], "Security code", "Here is your verefication code: " + Math.floor(100000 + Math.random() * 900000));
    showNotification("succesNote", "succesCooldown", header, msg);
    console.log(document.getElementById("remember").checked);
    if(document.getElementById("remember").checked){
        createCookie("email", data["email"]);
        createCookie("password", data["password"]);
        createCookie("username", data["username"]);
    }
    await sleep(4900);
    window.history.go(-1);
}

async function loginFail(msg, header) {
    showNotification("errorNote", "errorCooldown", header, msg);
    await sleep(4900);
}

async function showNotification(noteId, coolDownId, noteHeader, noteMessage) {
    if(noteId == "errorNote" && isErrorNoteMoving == false) isErrorNoteMoving = true;
    else if(noteId == "succesNote" && isSuccesNoteMoving == false) isSuccesNoteMoving = true;
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
    if(noteId == "errorNote") isErrorNoteMoving = false;
    else isSuccesNoteMoving = false;
}

function createCookie(cookieName, cookieValue){
    var expires = (new Date(Date.now()+ 86400*4000)).toUTCString();
    document.cookie = cookieName+'='+cookieValue+'; expires=' + expires + ';path=/';
    console.log("cookie created");
}



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

const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};