//* FRONT VARIABLES
const blob = document.getElementById("moveTarget");
var isErrorNoteMoving = false;
var isSuccesNoteMoving = false;
//* BACK VARIABLES
const inputData = { "email": document.getElementById("emailInput"), "newPassword": document.getElementById("newPswInput"), "newPasswordConfirm": document.getElementById("newPswConfirmInput") };

//* /DATA BASE SERVICES///////////////////////////////////////
//* //////////////////////////////////////////////////////////
//* //////////////////////////////////////////////////////////

function submitForm() {
    if (inputData["email"].getAttribute("value") == "" || inputData["newPassword"].getAttribute("value") == "" || inputData["newPasswordConfirm"].getAttribute("value") == "") {
        showNotification("error", "All fields are required");
    }
    else if (inputData["newPassword"].getAttribute("value") != inputData["newPasswordConfirm"].getAttribute("value")) {
        showNotification("error", "New passwords don't match");
    }
    else {
        sendEmailAndCode();
    }
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
                changePassword();
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

function changePassword() {
    fetch('http://localhost:8080/api/user/change-psw', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": inputData["email"].getAttribute("value"), "password": inputData["newPasswordConfirm"].getAttribute("value") })
    })
        .then(response => {
            if (response["status"] == 200) {
                response.text().then(data => { console.log(data) });

                window.history.go(-1);
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
            showNotification("error", "We couldn't change the password, try again later");
        });
}

const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};


//* /FRONTEND SERVICES///////////////////////////////////////
//* //////////////////////////////////////////////////////////
//* //////////////////////////////////////////////////////////
document.documentElement.addEventListener("mouseleave", () =>
    blob.style.scale = "0");
document.documentElement.addEventListener("mouseenter", () =>
    blob.style.scale = "2");


document.querySelectorAll("input").forEach(element => {
    element.addEventListener("focus", blobSmaller);
    element.addEventListener("blur", blobBigger);
});

function blobSmaller() {
    blob.style.scale = "1.5";
}

function blobBigger() {
    blob.style.scale = "2";
}

function showEmailWindow() {
    let inputs = document.getElementsByTagName("input");
    for (let input of inputs) {
        input.setAttribute("tabindex", "-1");
    }
    document.getElementById("emailBox").style.scale = "1";
    document.getElementById("emailIcon").style.animation = "1s ease-in 1s forwards emailFlyOut";
    document.getElementById("truck").style.animation = "3s ease truckDrive";
}

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
    cooldown.style.animation = "2s linear 0.5s reverse forwards cooldownMove";
    await sleep(2900);
    note.style.animation = "0.5s ease forwards noteMoveDown";
    await sleep(500);
    cooldown.style.width = "300px";
    note.style.display = "none";
    if (noteId == "errorNote") isErrorNoteMoving = false;
    else isSuccesNoteMoving = false;
}
