window.addEventListener("load",()=>{
    var link = document.createElement("link");
    link.href = "/scripts/cookies/cookies.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    var htmlContent = `<div id="cookieContainer">
            <div id="cookieBanner">
              <h1>Achtung Cookies!</h1>
              <p>Diese Seite speichert lokal Nutzerdaten.</p>
              <button id="cookieButton">Akzeptieren</button>
            </div>
        </div>`
    document.body.appendChild(createHTML(htmlContent));
    if(document.getElementById("cookieContainer")){
        document.getElementById("cookieButton").onclick = cookiesButtonClick
    }else{
        console.warn("Kein Cookie-Container verfügbar.");
    }
})

function init_cookies(){
    cookiesStyleToggle()
}

function cookiesButtonClick(){
    luckySite.changeSetting("cookies", true);
    cookiesStyleToggle();
}

function cookiesStyleToggle(){
    if(document.getElementById("cookieContainer")){
        if(luckySite.settings.cookies){
            document.getElementsByTagName("html")[0].classList.remove("noscroll");
            document.getElementById("cookieContainer").style.display = "none";
        }else{
            document.getElementsByTagName("html")[0].classList.remove("noscroll");
            document.getElementById("cookieContainer").style.display = "flex";
        }
    }else{
        console.warn("Kein Cookie-Container verfügbar.");
    }
}
