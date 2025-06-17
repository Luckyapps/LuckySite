function initUi(){
    setAutoNavbar(); //integration mit linkmanager prüfen
    loadNavbar(); //Einfügen der Steuerelemente muss überarbeitet werden.
    
    initDarkmode();
    setAutoDarkmode();
}

function setTextfields(){ //Autofill Textfelder
    for(i=0;i<document.getElementsByClassName("versionDisplay").length;i++){
        document.getElementsByClassName("versionDisplay")[i].innerHTML = luckySite.version;
    }
    for(i=0;i<document.getElementsByClassName("currentYear").length;i++){
        document.getElementsByClassName("currentYear")[i].innerHTML = new Date().getFullYear();
    }
}