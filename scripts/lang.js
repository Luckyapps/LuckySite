function initlang(){
    if(!window.location.pathname.includes("/"+luckySite.settings.lang+"/")){
        if(luckySite.settings.lang == "de" && (window.location.pathname != "/index.html" && window.location.pathname != "/")){
            console.log("Wrong lang");
        }
        if(window.location.pathname.includes("/en/")){
            luckySite.Sitelang = "en";
            luckySite.changeSetting("lastLang","en");
        }else if(window.location.pathname.includes("/de/")){
            luckySite.Sitelang = "de"
            luckySite.changeSetting("lastLang","de");
        }
    }
}

function setAutoLang(){ //Wechelst automatisch zur vom User bevorzugten Sprache (navigator.language)
    if(luckySite.settings.autoLang == true){
        var link = window.location.href;
        window.location = link.replace("/"+luckySite.Sitelang+"/", "/"+navigator.language+"/");
    }else{
        console.log("autoLang ist deaktiviert.");
    }
}