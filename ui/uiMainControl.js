async function initUi(){
    setAutoNavbar(); //integration mit linkmanager prüfen

    if(luckySite.settings.showNavbarSettings){
        loadNavbar(); //Einfügen der Steuerelemente muss überarbeitet werden.
    }

    try{
        getAutoLinksJson();
    }catch(err){
        console.warn("Beim laden der autoLinks aus der autoLinks.json ist ein Fehler aufgetreten.")
    }

    autoLink_initLangs();

    setFooterPath();

    if(luckySite.settings.uniFooter){
        await initUniFooter(); //Inhalt des uniFooters laden
        loadUniFooter(); //führt auch setFooterPath() und setFooterLangs() aus
    }else{
        await setFooterLangs(); //Auch wenn custom Footer Sprachen setzen, setzt auch das Sprachicon in der Navbar
    }


    //setFooterLangs(); //Notwendig, damit navbar sprachicon gesetzt wird. MUSS GEÄNDERT WERDEN (da funktion im Linkmanager gestartet wird bevor das HTML eingefügt wurde)
    
    setAutoLinks(); //integration mit linkmanager prüfen

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