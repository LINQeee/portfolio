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
function createCookie(cookieName, cookieValue, expireTime) {
    var expires = (new Date(Date.now() + expireTime)).toUTCString();
    document.cookie = cookieName + '=' + cookieValue + '; expires=' + expires + ';path=/';
    console.log("cookie created");
}

//*ON CLICK SUBMIT BUTTON//////////////
function submitForm() {
    if (isRegistering && inputData["email"].getAttribute("value").length != 0 && inputData["password"].getAttribute("value").length != 0 && inputData["username"].getAttribute("value").length != 0) {
        registerUser();//*if registering
    }
    else if (inputData["email"].getAttribute("value").length != 0 && inputData["password"].getAttribute("value").length != 0) {
        checkIsPasswordCorrect();//* if loginning
    }
}

function registerUser() {
    fetch('http://localhost:8080/api/user/new-user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": inputData["email"].getAttribute("value"), "password": inputData["password"].getAttribute("value"), "username": inputData["username"].getAttribute("value") })
    })
        .then(response => {
            if (response["status"] == 200) {
                sendEmailAndCode();
                response.text().then(data => {
                    showNotification("succes", data);
                    console.log(data);
                });
            }
            else if (response["status"] == 500) {
                response.json().then(data => {
                    if (data["type"] != "UNEXPECTED") {
                        showNotification("error", data["message"]);
                    }
                    else {
                        showNotification("error", "An unexpected error has occurred");
                    }
                });
            }
            else {
                showNotification("error", "An unexpected error has occurred");
            }
        }).catch(function () {
            showNotification("error", "We couldn't create an account");
        });
}

function checkIsPasswordCorrect() {
    fetch('http://localhost:8080/api/user/check-user-password', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": inputData["email"].getAttribute("value"), "password": inputData["password"].getAttribute("value") })
    })
        .then(response => {
            if (response["status"] == 200) {
                sendEmailAndCode();
            }
            else if (response["status"] == 500) {
                response.json().then(data => {
                    if (data["type"] != "UNEXPECTED") {
                        showNotification("error", data["message"]);
                    }
                    else {
                        showNotification("error", "An unexpected error has occurred");
                    }
                })
            }
            else {
                showNotification("error", "An unexpected error has occurred");
            }
        })
        .catch(function () {
            showNotification("error", "We couldn't check is password or email match, try again later");
        });
}


function verificationCodeCheck() {
    fetch('http://localhost:8080/api/user/check-user-code', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "code": document.getElementById("verificationCode").getAttribute("value"), "email": inputData["email"].getAttribute("value") })
    })
        .then(response => {
            if (response["status"] == 200) {
                response.text().then(data => { console.log(data) });
                var expireTime;
                if (document.getElementById("remember").checked)
                    expireTime = 86400 * 4000;
                else expireTime = 100000;
                
                getUserByEmail(inputData["email"].getAttribute("value")).then(userData => {
                    createCookie("username", userData["username"], expireTime);
                    createCookie("email", userData["email"], expireTime);
                    createCookie("password", userData["password"], expireTime);
                    window.history.go(-1);
                });

            }
            else if (response["status"] == 500) {
                response.json().then(data => {
                            if (data["type"] != "UNEXPECTED") {
                                showNotification("error", data["message"]);
                            }
                            else {
                                showNotification("error", "An unexpected error has occurred");
                            }
                });
            }

        }).catch(function (error) {
            console.log(error);
            showNotification("error", "We couldn't compare code, try again later");
        });
}


function sendEmailAndCode() {
    fetch('http://localhost:8080/api/code/send-code', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: inputData["email"].getAttribute("value")
    })
        .then(response => {
            if (response["status"] == 200) {
                showEmailWindow();
            }
            else if (response["status"] == 500) {
                response.json().then(data => {
                    if (data["type"] != "UNEXPECTED") {
                        showNotification("error", data["message"]);
                    }
                    else {
                        showNotification("error", "An unexpected error has occurred");
                    }
                });
            }
            else {
                showNotification("error", "An unexpected error has occurred");
            }
        }).catch(function () {
            showNotification("error", "We couldn't send a request to server, try again later");
        });
}

async function getUserByEmail(email) {
    return fetch('http://localhost:8080/api/user/get-user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: email
    })
        .then(response => {
            if (response["status"] == 200) {
                return response.json().then(data => {
                    return data;
                })
            }
            else if (response["status"] == 500) {
                response.json().then(data => {
                    if (data["type"] != "UNEXPECTED") {
                        showNotification("error", data["message"]);
                    }
                    else {
                        showNotification("error", "An unexpected error has occurred");
                    }
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



function showEmailWindow() {
    let inputs = document.getElementsByTagName("input");
    for (let input of inputs) {
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
    if (noteType.toLowerCase() == "error" && isErrorNoteMoving == false) {
        noteId = "errorNote";
        coolDownId = "errorCooldown";
        noteHeader = "Oops, something went wrong!";
        isErrorNoteMoving = true;
    }
    else if (noteType.toLowerCase() == "succes" && isSuccesNoteMoving == false) {
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


