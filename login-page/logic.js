const username = document.getElementById("username");
const signLink = document.getElementById("signLink");
const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const submit = document.getElementById("submit");
const header = document.getElementById("header");

var isRegistering;

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

    usernameInput.value = '';

    submit.innerHTML = "login";
    header.innerHTML = "Login to Your Account";
    isRegistering = false;
}

function setValue(id, isPassowrd) {
    var newValue;
    var element = document.getElementById(id);
    var inputValue = element.value;
    if(inputValue.length > element.getAttribute("value").length){
    newValue = element.getAttribute("value") + inputValue[inputValue.length-1];
    }
    else{
    newValue = element.getAttribute("value").slice(0, element.getAttribute("value").length-1);
    }
    var newInputValue = newValue;
    element.setAttribute("value", newValue); 
    if(isPassowrd){
    for (let index = 0; index < element.getAttribute("value").length; index++) {
        newInputValue = setCharAt(newInputValue, index, "●");
        
    }}
    element.value = newInputValue;
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function tryLogin() {
    if(isRegistering){
        var ajaxRequest;
        ajaxRequest = $.ajax({
            url: "/DataBaseServices/registerNewUser.php",
            type: "post",
            data: JSON.stringify([{"functionName": "insert"},{"dbName": "usersData","username": usernameInput ,"email": emailInput, "password": passwordInput}]),
            contentType: "application/json; charset=utf-8",
            traditional: true
        });

        ajaxRequest.done(function(response, textStatus, jqXHR){
            console.log(response, textStatus);
            registerSucces();
        });

        ajaxRequest.fail(function(){
            console.log("error");
            registerFail();
        });
    }
    return false;
}

async function registerSucces() {
    var succesNote = document.getElementById("succesNote");
    var succesCooldown = document.getElementById("succesCooldown");
    succesNote.style.animation = "noteMove forwards";
    succesNote.style.animationTimingFunction = "ease";
    succesNote.style.animationDuration = "3s";
    succesCooldown.style.animationDelay = "3s";
    succesCooldown.style.animation = "cooldownMove reverse forwards";
    succesCooldown.style.animationTimingFunction = "linear";
    succesCooldown.style.animationDuration = "5s";
    await setTimeout(8000);
    succesNote.style.animation = "noteMove reverse forwards";
    await setTimeout(3000);
    succesCooldown.style.width = "300px";

}

async function registerFail() {
    var errorNote = document.getElementById("errorNote");
    var errorCooldown = document.getElementById("errorCooldown");
    errorNote.style.animation = "noteMove forwards";
    errorNote.style.animationTimingFunction = "ease";
    errorNote.style.animationDuration = "3s";
    errorCooldown.style.animationDelay = "3s";
    errorCooldown.style.animation = "cooldownMove reverse forwards";
    errorCooldown.style.animationTimingFunction = "linear";
    errorCooldown.style.animationDuration = "5s";
    await setTimeout(8000);
    errorNote.style.animation = "noteMove reverse forwards";
    await setTimeout(3000);
    errorCooldown.style.width = "300px";
}