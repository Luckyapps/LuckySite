var linkmanager = {
    loaded: false,
    load: async function(pathLangForce){
        if(pathLangForce==undefined){
            var pathLang = window.location.pathname.substring(1,3);
        }else{
            var pathLang = pathLangForce;
            console.warn("Custom pathLang "+ pathLang +" im Linkmanager wird angewendet.");
        }
        var location = window.location.pathname.replace("index.html","");//Prepare location
        for(j=0;j<Object.keys(sitemap).length;j++){
            var siteId = Object.keys(sitemap)[j];
            for(k=0;k<Object.keys(sitemap[siteId]).length;k++){
                var langId = Object.keys(sitemap[siteId])[k];
                if(langId == pathLang){
                    if(sitemap[siteId][langId].link == location){
                        if(typeof customNavbar != "undefined" && customNavbar != undefined && customNavbar != 0 && customNavbar != null){
                            var navbarList = customNavbar;
                            console.log("CustomNavbar angewendet");
                        }else{
                            var navbarList = ["home","documentation", "autolinkdoc" ,"maintenance"];
                        }
                        linkmanager.pageData = {
                            siteId: siteId,
                            lang: langId,
                            parents: [],
                            navbar: navbarList,
                            data: sitemap[siteId][langId]
                        };
                        var parentId = siteId;
                        while(sitemap.getParent(parentId) != false){ //loading parents List
                            parentId = sitemap.getParent(parentId);
                            linkmanager.pageData.parents.unshift(parentId);
                        }
                        var ableToLoad = true;
                        //console.log(linkmanager.pageData);
                    }
                }
            }
        }
        if(!ableToLoad){
            if(sitemap.byLang[window.location.pathname.substring(1,3)] == undefined){
                console.warn("Der Pfad dieser Seite ist keiner Sprache zugeordnet.");
                if(pathLangForce==undefined){
                    if(luckySite.settings.rootHTMLDefaultLang!=undefined){
                        console.log("neuLaden 1");
                        linkmanager.load(luckySite.settings.rootHTMLDefaultLang);
                        return;
                    }
                }else{
                    console.error("rootHTMLDefaultLang konnte nicht angewendet werden.");
                }
            }else 
            if(luckySite.settings.enableAutoMaintenance){
                if(urlData.forceLoad){ //Forceload
                    console.error("Seite wurde zwangsgeladen. Es kann zu unerwarteten Fehlern kommen. Der Linkmanager und pageData sind möglicherweise nicht verfügbar.");
                    console.warn("Kommt es zu Fehlern ist die Seite möglicherweise nicht in sitemap.js vorhanden.");
                    linkmanager.loaded = true;
                    return;
                }else{
                    window.location = sitemap.byLang[window.location.pathname.substring(1,3)].maintenance.link;
                }
            }
            console.error("Linkmanager ist auf diser Seite nicht verfügbar. Möglicherweise wurde die Seite noch nicht in sitemap.js hinzugefügt.");
            console.warn("setFooterPath(), setFooterLangs(), setAutoNavbar() und setAutoLinks() werden nicht ausgeführt.");
            return;
        }
        linkmanager.loaded = true;
    }
}

function setAutoLinks(){
    var autoLinks = document.getElementsByClassName("autoLink");
    for(i=0;i<autoLinks.length;i++){
        try{
            if(autoLinks[i].getAttribute("autoLink-type") == "onsite"){
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        var autoLink_lang = linkmanager.pageData.lang;
                        var autoLink_name = sitemap[id][autoLink_lang].name
                        if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){
                            var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        }
                        if(autoLinks[i].getAttribute("autoLink-keepText")!=undefined){
                            var autoLink_name = autoLinks[i].innerHTML;
                        }
                        try{
                            autoLinks[i].href = sitemap[id][autoLink_lang].link;
                            autoLinks[i].innerHTML = autoLink_name;
                        }catch{
                            autoLinks[i].href = sitemap[id][linkmanager.pageData.lang].link;
                            autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].name;
                            console.log("autoLink lang error fallback");
                        }
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "onsiteNOa"){ //Hier wird der Text des Elements nicht automatisch gesetzt.
                if(autoLinks[i].getAttribute("autoLink-Id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        var autoLink_lang = linkmanager.pageData.lang;
                        if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){ //Lang
                            var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        }
                        if(autoLinks[i].getAttribute("autoLink-setText")!=undefined){ //Autotext
                            try{
                                autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].name;
                            }catch(err){
                                console.warn("Bei folgendem autoLink konnte der Text nicht gesetzt werden:");
                                console.warn(autoLinks[i]);
                            }
                        }
                        try{
                            var link = sitemap[id][autoLink_lang].link;
                        }catch{
                            var link = sitemap[id][linkmanager.pageData.lang].link;
                            console.log("autoLink lang error fallback");
                        }
                        //var link = sitemap[id][linkmanager.pageData.lang].link; //Zu viel?????
                        autoLinks[i].onclick= ()=>{window.location = link}
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "offsite"){
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    var luckySite_autoLinks = JSON.parse(JSON.stringify(luckySite.autoLinks)); //Echte kopie von luckySite.autoLinks erstellen.
                    if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){ //Lang
                        var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        try{
                            var elem_autoLink = getAutoLinkByLang(id, autoLink_lang);
                            if(elem_autoLink != false){
                                luckySite_autoLinks[id] = elem_autoLink;
                            }else{
                                console.warn("autoLink Fehler bei offsite Lang Fallback");
                                luckySite_autoLinks = luckySite.autoLinks
                            }
                        }catch(err){
                            console.warn("autoLink Fehler bei offsite Lang");
                            luckySite_autoLinks = luckySite.autoLinks
                        }
                    }
                    if(luckySite_autoLinks[id]!=undefined){
                        if(autoLinks[i].nodeName == "A"){
                            if(autoLinks[i].getAttribute("autoLink-keepText")==undefined){
                                autoLinks[i].innerHTML = luckySite_autoLinks[id].name;
                            }
                        }else{
                            if(autoLinks[i].getAttribute("autoLink-setText")!=undefined){
                                autoLinks[i].innerHTML = luckySite_autoLinks[id].name;
                            }
                        }
                        if((luckySite_autoLinks[id].href != "wartung" && luckySite_autoLinks[id].href != "" && luckySite_autoLinks[id].href != undefined)){
                            if(autoLinks[i].nodeName == "A"){
                                autoLinks[i].href = luckySite_autoLinks[id].href;
                                /*if(autoLinks[i].getAttribute("autoLink-keepText")==undefined){
                                    autoLinks[i].innerHTML = luckySite_autoLinks[id].name;
                                }*/
                            }else{
                                autoLinks[i].onclick= ()=>{window.location = link}
                                /*if(autoLinks[i].getAttribute("autoLink-setText")!=undefined){
                                    autoLinks[i].innerHTML = luckySite_autoLinks[id].name;
                                }*/
                            }
                        }else{
                            autoLinks[i].removeAttribute("href");
                            switch(linkmanager.pageData.lang){
                                case "de": 
                                    autoLinks[i].onclick=()=>{info.show(`Dieser Link ist aktuell nicht verfügbar.`)};
                                    break;
                                case "en":
                                    autoLinks[i].onclick=()=>{info.show(`This link is currently not available.`)};
                                    break;
                                case "ch":
                                autoLinks[i].onclick=()=>{info.show(`此链接目前不可用。`)};
                                break;
                            }
                        }
                    }else{
                        autoLinks[i].removeAttribute("href");
                        switch(linkmanager.pageData.lang){
                            case "de": 
                                autoLinks[i].onclick=()=>{info.show(`Dieser Link ist aktuell nicht verfügbar.`)};
                                break;
                            case "en":
                                autoLinks[i].onclick=()=>{info.show(`This link is currently not available.`)};
                                break;
                            case "ch":
                                    autoLinks[i].onclick=()=>{info.show(`此链接目前不可用。`)};
                                break;
                        }
                        console.warn(`luckySite_autoLinks[id] mit id ${id} in offsite nicht definiert.`);
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "download"){
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(luckySite.autoLinks[id].href != "wartung" && luckySite.autoLinks[id].href != "" && luckySite.autoLinks[id].href != undefined){
                        autoLinks[i].href = luckySite.autoLinks[id].href;
                        autoLinks[i].innerHTML = luckySite.autoLinks[id].name;
                        if(luckySite.autoLinks[id].download_name != "" && luckySite.autoLinks[id].download_name != "wartung" && luckySite.autoLinks[id].download_name != undefined){
                            autoLinks[i].download = luckySite.autoLinks[id].download_name;
                        }else if(!luckySite.settings.downloadToLink || (luckySite.settings.downloadToLink && luckySite.autoLinks[id].download_force)){
                            console.warn("Downloadfunktion bei folgendem AutoLink nicht verfügbar:");
                            console.warn(autoLinks[i]);
                            autoLinks[i].removeAttribute("href");
                            switch(linkmanager.pageData.lang){
                                case "de": 
                                    autoLinks[i].onclick=()=>{info.show(`Dieser Download ist aktuell nicht verfügbar.`)}
                                    break;
                                case "en":
                                    autoLinks[i].onclick=()=>{info.show(`This download is currently not available.`)};
                                    break;
                                case "ch":
                                    autoLinks[i].onclick=()=>{info.show(`此链接目前不可用。`)};
                                    break;
                            }
                        }
                    }else{
                        if(luckySite.autoLinks[id].name != "" && luckySite.autoLinks[id].name != "wartung" && luckySite.autoLinks[id].name != undefined){
                            autoLinks[i].innerHTML = luckySite.autoLinks[id].name;
                        }
                        autoLinks[i].removeAttribute("href");
                        switch(linkmanager.pageData.lang){
                            case "de": 
                                autoLinks[i].onclick=()=>{info.show(`Dieser Download Link ist aktuell nicht verfügbar.`)};
                                break;
                            case "en":
                                autoLinks[i].onclick=()=>{info.show(`This download link is currently not available.`)};
                                break;
                            case "ch":
                                autoLinks[i].onclick=()=>{info.show(`此链接目前不可用。`)};
                                break;
                        }
                    }
                }
            }else{
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        var autoLink_lang = linkmanager.pageData.lang;
                        var autoLink_path = sitemap[id][autoLink_lang].name
                        if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){
                            var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        }
                        if(autoLinks[i].getAttribute("autoLink-keepText")!=undefined){
                            var autoLink_path = autoLinks[i].innerHTML;
                        }
                        try{
                            autoLinks[i].href = sitemap[id][autoLink_lang].link;
                            autoLinks[i].innerHTML = autoLink_path;
                        }catch{
                            autoLinks[i].href = sitemap[id][linkmanager.pageData.lang].link;
                            autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].name;
                            console.log("autoLink lang error fallback");
                        }
                    }
                }
            }
        }catch(err){
            //Warnmeldung für User hinzufügen
            switch(linkmanager.pageData.lang){
                case "de": 
                    autoLinks[i].onclick=()=>{info.show(`Dieser Link ist aktuell nicht verfügbar.`)};
                    break;
                case "en":
                    autoLinks[i].onclick=()=>{info.show(`This link is currently not available.`)};
                    break;
                case "ch":
                    autoLinks[i].onclick=()=>{info.show(`此链接目前不可用。`)};
                    break;
            }
            console.warn(`[autoLinks] Es liegt ein Problem mit dem folgenden AutoLink vor:`);
            console.warn(autoLinks[i]);
            autoLinks[i].removeAttribute("href");
        }
    }
}

function autoLink_initLangs(){ //Setzt die für die aktuelle Sprache richtigen Werte für ein
    if(luckySite.autoLinks){
        for(i=0;i<Object.keys(luckySite.autoLinks).length; i++){
            var id = Object.keys(luckySite.autoLinks)[i];
            if(luckySite.autoLinks[id].langs){
                if(linkmanager.pageData && linkmanager.pageData.lang){
                    var linkLangs = luckySite.autoLinks[id].langs;
                    for(j=0;j<Object.keys(linkLangs).length;j++){
                        if(linkmanager.pageData.lang == Object.keys(linkLangs)[j]){
                            var lang = linkmanager.pageData.lang;
                            var parameters = ["name", "href", "download_name", "download_force"]; //Änderbare Parameter
                            parameters.forEach(parameter => {
                                if(linkLangs[lang][parameter] != undefined && linkLangs[lang][parameter] != "wartung" && linkLangs[lang][parameter] != ""){
                                    luckySite.autoLinks[id][parameter] = linkLangs[lang][parameter];
                                }
                            })
                        }
                    }
                }
            }   	
        }
    }
}

function getAutoLinkByLang(id, lang){ //Gibt das autoLink Object, in der entsprechenden Sprache zurück; Bei fehler wird false ausgegeben.
    luckySite_autoLinks = JSON.parse(JSON.stringify(luckySite.autoLinks)); //Echte kopie von luckySite.autoLinks erstellen.
    if(luckySite_autoLinks[id]){
        if(lang == linkmanager.pageData.lang){
            console.warn("autoLink Sprache ist gleich der Seitensprache.")
            return luckySite_autoLinks[id];
        }
        if(luckySite_autoLinks[id].langs){
            var autoLinks_temp = luckySite_autoLinks[id];
            var linkLangs = luckySite_autoLinks[id].langs;
            var parameters = ["name", "href", "download_name", "download_force"]; //Änderbare Parameter
            if(linkLangs[lang]){
                parameters.forEach(parameter => {
                    if(linkLangs[lang][parameter] != undefined && linkLangs[lang][parameter] != "wartung" && linkLangs[lang][parameter] != ""){
                        autoLinks_temp[parameter] = linkLangs[lang][parameter];
                    }
                })
                return autoLinks_temp;
            }else{
                console.warn("autoLink lang nicht verfügbar.");
                return false;
            }
        }   	
    }else{
        console.warn("autoLink id nicht verfügbar.");
        return false;
    }
}

async function getAutoLinksJson(){
    var jsonData = await getData("/scripts/autoLinks.json");
    var counter = 0;
    if(luckySite.autoLinks){
        for(i=0;i<Object.keys(jsonData).length;i++){
            luckySite.autoLinks[Object.keys(jsonData)[i]] = jsonData[Object.keys(jsonData)[i]];
            counter++;
        }
        console.log(`${counter} Einträge aus autoLinks.json geladen`);
    }else{
        console.warn("luckySite.autoLinks nicht vorhanden");
        luckySite.autoLinks = {};
        getAutoLinksJson();
    }
}

luckySite.autoLinks = {
    template: {
        name: "", //Standard Anzeigename
        href: "", //Standard Link
        download_name: "", //Name und Dateipräfix der Downloaddatei (optional)
        download_force: true, //Verhindert downloadToLink (optional)
        langs: { //Hier können Sprachspezifische änderungen definiert werden (optional)
            de: { //Id der Sprache
                name: "", //Parameter, die geändert werden sollen
                href: ""
            },
            en: {
                name: "",
                href: "",
                download_name: ""
            }
        }
    },
    youtube: {
        name: "YouTube",
        href: "https://www.youtube.com/@luckySitewerke",
    },
    luckyapps: {
        name: "LuckyApps",
        href: "wartung"
    },
    matchofmemes: {
        name: "MatchOfMemes",
        href: "wartung"
    },
    fotografiefreude: {
        name: "fotografiefreude",
        href: "wartung"
    },
    soundriseproductions: {
        name: "Soundrise Productions",
        href: "https://www.youtube.com/@soundriseproductions9976"
    },
    adac_liste: {
        name: "Liste",
        href: "https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle"
    },
    download_documentation: {
        name: "Dokumentation",
        href: "wartung",
        download_name: "Dokumentation.pdf",
        download_force: true,
        langs: {
            en: {
                name: "Documentation",
                href: "wartung",
                download_name: "Documentation.pdf"
            }
        }
    },
    download_windows:{
        name: "Download (Windows)",
        href: "wartung",
        download_name: "wartung",
        download_force: true
    },
    telegram:{
        name: "telegram",
        href: "wartung"
    },
    signal:{
        name: "signal",
        href: "wartung"
    },
    Pflanzanbieter:{
        name: "Pflanzanbieter",
        href: "https://luckySitewerke.onlyoffice.com/s/YbVg6smhGHtQSrT"
    },
    CO2Verarbeitung:{
        name: "CO2 Verarbeitung",
        href: "https://luckySitewerke.onlyoffice.com/s/WsrLZkrDmCQ_C4h"
    },
    PflanzanbieterOffen:{
        name: "Pflanzanbieter Offen",
        href: "https://luckySitewerke.onlyoffice.com/s/snZYXQf2m3myghn"
    },
    CO2VerarbeitungOffen:{
        name: "CO2 Verarbeitung Offen",
        href: "https://luckySitewerke.onlyoffice.com/s/62vz4S47VGmLDGr"
    },
    KurzumrissGR:{
        name: "Kurzumriss Grünzeugrechner",
        href: "https://luckySitewerke.onlyoffice.com/s/-tRSBPF89NX3hVF"
    }
}

