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
  if(document.cookie.indexOf("userEmail") == -1 || document.cookie.indexOf("userPassword") == -1){
    document.getElementById("firstIcon").classList.add("fa-right-to-bracket");
    document.getElementById("secondIcon").classList.add("fa-user-plus");
    document.getElementById("firstSpan").innerHTML = "log in".toUpperCase();
    document.getElementById("secondSpan").innerHTML = "sign up".toUpperCase();
    document.getElementById("firstButton").onclick = function(){window.location.href = "/loginPage/login-page.html"}
  }
  else{
    /*
    document.getElementById("firstIcon").classList.add("fa-user");
    document.getElementById("secondIcon").classList.add("fa-arrow-right-from-bracket");
    document.getElementById("firstSpan").innerHTML = "profile".toUpperCase();
    document.getElementById("secondSpan").innerHTML = "sign out".toUpperCase();
    */
  }
}