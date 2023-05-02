var isOnAvatar;

window.onload = initPage();

function unlockAvatarMenu() {
    console.log("unlocked");
    isOnAvatar = true;
    const elements = document.querySelectorAll(".hiddenAvatarButton");

    for (const element of elements) {
        element.style.transform = "scaleY(1)";
      }

        document.getElementById("menu").style.height = "160px";
        document.getElementById("box").style.transform = "scaleY(1)";
}

function mouseNotOverAvatar() {
  isOnAvatar = false;
}

function lockAvatarMenu() {
  if(!isOnAvatar){
  console.log("locked");
    const elements = document.querySelectorAll(".hiddenAvatarButton");

    for (const element of elements) {
       element.style.transform = "scaleY(0)";
      }

        document.getElementById("menu").style.height = "0px";
        document.getElementById("box").style.transform = "scaleY(0)";
    }
}

function initPage() {
  if(getCookie("email") == "" || getCookie("password") == ""){
    document.getElementById("firstIcon").classList.add("fa-right-to-bracket");
    document.getElementById("secondIcon").classList.add("fa-user-plus");
    document.getElementById("firstSpan").innerHTML = "log in".toUpperCase();
    document.getElementById("secondSpan").innerHTML = "sign up".toUpperCase();
    document.getElementById("firstButton").onclick = function(){window.location.href = "/login-page/loginPage.html"}
    document.getElementById("username").innerHTML = "";
  }
  else{
    
    document.getElementById("firstIcon").classList.add("fa-user");
    document.getElementById("secondIcon").classList.add("fa-arrow-right-from-bracket");
    document.getElementById("firstSpan").innerHTML = "profile".toUpperCase();
    document.getElementById("secondSpan").innerHTML = "sign out".toUpperCase();
    document.getElementById("username").innerHTML = getCookie("username");
  }
}

function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}