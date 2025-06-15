var settingsStorageName = "luckySiteSettings";

function initSettings(){ //ONLOAD
    luckySite.loadSettings = ()=>{
        var settingsVersion = 1; //Muss bei änderung der Standardeinstellungen geändert werden.
        if(localStorage.getItem(settingsStorageName)){
            if(settingsVersion > JSON.parse(localStorage.getItem(settingsStorageName)).settingsVersion){
                localStorage.removeItem(settingsStorageName);
                luckySite.loadSettings();
                console.warn("Einstellungen Aktualisiert");
            }
            luckySite.settings = JSON.parse(localStorage.getItem(settingsStorageName));
        }else{
            luckySite.settings = { //standard settings
                settingsVersion: settingsVersion,
                visits: 0, //Anzahl der Seitenbesuche seit letztem zurücksetzen
                darkmode: false, //Darkmode an/aus
                cookies: false, //Cookies akzepiert
                lang: "de", //Eingestellte Sprache ??????
                lastLang: "de", //Letzte Sprache
                autoLang: false, //Wenn true, wird versucht beim ersten besuchen der Seite die vom User voreingestellte Sprache zu laden (funktioniert noch nicht richtig)
                currentPage: window.location.href, //aktuelle Seite
                autoDarkmode: true, //Automatisches Anpassen des Darkmodes an die Userpräferenzen
                enableAutoMaintenance: true, //AutoMaintenance wird eine in der sitemap nicht verfügbare Seite direkt überspringen und zur Wartungsseite weiterleiten
                rootHTMLDefaultLang: "de", //["SprachId" | undefined] Soll für eine HTML-Datei im Rootverzeichnis (/) den Linkmanager nutzen, muss hier eine Sprache dafür angegeben werden.
                firstLoad: true, //Wird nach dem ersten vollen Seitenladevorgang false
                downloadToLink: true, //Ist der Wert true, werden AutoLinks mit autoLink-type="download" als normaler Link geladen, wenn download_name im linkmanger nicht gesetzt oder "wartung" ist.
                uniFooter: true, //Stellt ein, ob ein Universeller Footer geladen wird.
                uniFooterSetHTML: true, //Wenn true wird das gesammt HTML im footer Tag automatisch gesetzt.
                homeId: "home" //Die Sitemap Id, der Home Seite
            }
            localStorage.setItem(settingsStorageName, JSON.stringify(luckySite.settings));
        }
    };
    
    luckySite.changeSetting = (setting, value)=>{
        //console.log(`Einstellung ${setting} wird von ${luckySite.settings[setting]} zu ${value} geändert.`)
        luckySite.settings[setting] = value;
        localStorage.setItem(settingsStorageName, JSON.stringify(luckySite.settings));
        luckySite.loadSettings();
        //info_show("Einstellungen gespeichert.","success");
    };

    luckySite.resetSettings = ()=>{
        localStorage.removeItem(settingsStorageName);
        luckySite.loadSettings();
        console.warn("Alle Einstellungen wurden zurückgesetzt.");
    }
}