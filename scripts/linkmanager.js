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
                            var navbarList = ["sources","impressum","home","planting","pinwall"];
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
                    try{
                        getAutoLinksJson();
                    }catch(err){
                        console.warn("Beim laden der autoLinks aus der autoLinks.json ist ein Fehler aufgetreten.")
                    }
                    setFooterPath();
                    if(luckySite.settings.uniFooter){
                        await initUniFooter();
                        loadUniFooter();
                    }else{
                        await setFooterLangs();
                    }
                    setAutoNavbar();
                    autoLink_initLangs();
                    setAutoLinks();
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
        try{
            getAutoLinksJson();
        }catch(err){
            console.warn("Beim laden der autoLinks aus der autoLinks.json ist ein Fehler aufgetreten.")
        }
        setFooterPath();
        if(luckySite.settings.uniFooter){
            await initUniFooter();
            loadUniFooter();
        }else{
            await setFooterLangs();
        }
        setAutoNavbar();
        autoLink_initLangs();
        setAutoLinks();
        linkmanager.loaded = true;
    }
}

function setFooterPath(){
    if(document.getElementsByClassName("fPath")[0]){
        try{
            var fPath = document.getElementsByClassName("fPath")[0];
            if(linkmanager.pageData.parents.length == 0){ //Wenn Keine Parents verfügbar
                fPath.innerHTML = "<a href='"+ sitemap[linkmanager.pageData.siteId][linkmanager.pageData.lang].link +"'>"+'<img alt="Home | luckySite Logo" src="/media/Logo_Idee_6.png"></a>';
            }else{
                fPath.innerHTML = "";
            }
            for(i=0;i<linkmanager.pageData.parents.length;i++){ //Wenn Parents verfügbar, durchloopen
                var currentParent = linkmanager.pageData.parents[i];
                //console.log(currentParent);
                if(typeof sitemap[currentParent][linkmanager.pageData.lang] != "undefined"){ //Wenn der Pfad nicht in der aktuellen Sprache verfügbar ist überspringen
                    if(currentParent == luckySite.settings.homeId){ //Wenn Home, dann Bild hinzufügen
                        fPath.innerHTML += "<a href='"+ sitemap[currentParent][linkmanager.pageData.lang].link +"'>"+'<img alt="Home | luckySite Logo" src="/media/Logo_Idee_6.png"></a>';
                    }else{
                        fPath.innerHTML += "<a href='"+ sitemap[currentParent][linkmanager.pageData.lang].link +"'><div>"+ sitemap[currentParent][linkmanager.pageData.lang].path +"</div></a>";
                    }
                    var pathDivider = "<div>/</div>"; // Trennzeichen
                    fPath.innerHTML += pathDivider;
                }
            }
            fPath.innerHTML += "<a href='"+ linkmanager.pageData.data.link +"'><div>"+ linkmanager.pageData.data.path +"</div></a>";
        }catch(err){
            console.warn("Footer Path konnte nicht gesetzt werden.");
        }
    }
}

function setFooterLangs(){ //Sorgt für die Anzeige der Spracheinstellungen (Im Settingsbereich der Navigation und im Footer)
    if(document.getElementsByClassName("fLang")[0]){
        for(j=0;j<document.getElementsByClassName("fLang").length;j++){
            var fLang = document.getElementsByClassName("fLang")[j];
            var footerLangs = {
                de:{
                    name: "Deutsch",
                    img: "/media/DE Symbol.png"
                },
                en:{
                    name: "English",
                    img: "/media/EN Symbol.png"
                },
                fr:{
                    name: "Francaise"
                },
                es:{
                    name: "Español"
                },
                pl:{
                    name: "Polski"
                },
                ch: {
                    name: "中文",
                    img: "/media/CH Symbol.png"
                }
            }
            var fLangOLDHtml = fLang.innerHTML;
            try{ //Setze das Flaggensymbol der aktuellen Sprache im Settings-Bereich automatisch (Symbol in der Navigationsleiste)
                if(document.getElementById("settings_lang")){
                    if(document.getElementById("settings_lang").nodeName == "IMG"){
                        document.getElementById("settings_lang").src = footerLangs[linkmanager.pageData.lang].img;
                        document.getElementById("settings_lang").alt = footerLangs[linkmanager.pageData.lang].name;
                    }
                }
            }catch(err){
                console.log("Bild für Spracheinstellung konnte nicht gesetzt werden");
            }
            try{
                fLang.innerHTML = "";
                for(i=0;i<Object.keys(footerLangs).length;i++){
                    var fLangNameImg = "";
                    if(fLang.getAttribute("fLang-img")=="true"){
                        if(footerLangs[Object.keys(footerLangs)[i]].img){
                            fLangNameImg = "<img alt='country flag "+ Object.keys(footerLangs)[i] +"' src='"+ footerLangs[Object.keys(footerLangs)[i]].img +"'></img>";
                        }
                    }
                    var fLangSelectedClasses = "";
                    if(fLang.getAttribute("fLang-optionsOnly")=="true"){
                        if(footerLangs[Object.keys(footerLangs)[i]].img){
                            fLangSelectedClasses = "hidden";
                        }
                    }
                    if(Object.keys(footerLangs)[i]==linkmanager.pageData.lang){
                        fLang.innerHTML += "<a href='"+ linkmanager.pageData.data.link +"' class='fLangSelected "+ fLangSelectedClasses +"'>"+ fLangNameImg + footerLangs[Object.keys(footerLangs)[i]].name +"</a>";
                    }else{
                        try{
                            fLang.innerHTML += "<a href='"+ sitemap[linkmanager.pageData.siteId][Object.keys(footerLangs)[i]].link +"'>"+ fLangNameImg + footerLangs[Object.keys(footerLangs)[i]].name +"</a>";
                        }catch(err){
                            //console.warn(`Die Seite ist nicht auf ${footerLangs[Object.keys(footerLangs)[i]].name} verfügbar.`);
                        }
                    }
                }
            }catch(err){
                console.warn("Footer Lang konnte nicht gesetzt werden.");
                try{
                    fLang.innerHTML = fLangOLDHtml;
                }catch(err){
                    console.warn("Manuelle Footer Lang auswahl konnte nicht wiederhergestellt werden.")
                }
            }
        }
    }
}

var unifooter;

async function initUniFooter(){
    switch (linkmanager.pageData.lang) {//Hier wird der Footer für jede Sprache einzeln festgelegt
        case "x": //Hier SprachId einfügen
            unifooter = [
                {
                    title: "Template",
                    hidden: true, //Wenn hidden true ist, wird der Abschnitt nicht im Footer angezeigt.
                    titleLink: { //Macht den Abschnittstitel selbst zu einem autoLink
                        autoLinkId: "template"
                    },
                    links: [
                        {   
                            customText:"TEST", //Ist der Wert gesetzt, wird er als Text im Link angezeigt. (autoLink-setText wird automatisch hinzugefügt)
                            autoLinkId: "home",
                            autoLinkType: "onsite",
                            autoLinkLang: "de",
                            attribute: "autoLink-keepText autoLink-setText" //Hier können weitere Attribute als plain Text eingegeben werden
                        },
                        {
                            autoLinkId: "home",
                            autoLinkType: "onsite",
                            autoLinkLang: "de",
                            attribute: "autoLink-keepText autoLink-setText" //Hier können weitere Attribute als plain Text eingegeben werden
                        }
                    ]
                },
            ]
            break;
        case "de"://Deutsch
            unifooter = [
                {
                    title: "Schnellverweis",
                    links: [
                        {autoLinkId: "home"},
                        {autoLinkId: "pinwall"},
                        {autoLinkId: "planting"},
                        //{autoLinkId: "download"},
                        {autoLinkId: "sources"},
                        {autoLinkId: "impressum"} // WARUM DEUTSCH?
                    ]
                },
                {
                    title: "Soziale Medien",
                    links: [
                        {autoLinkId: "youtube", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "Vorgestellt",
                    links: [
                        //{autoLinkId: "matchofmemes", autoLinkType: "offsite"},
                        {autoLinkId: "soundriseproductions", autoLinkType: "offsite"},
                        //{autoLinkId: "luckyapps", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "Dateien",
                    //titleLink: {autoLinkId: "download"},
                    links: [
                        //{autoLinkId: "download_documentation", autoLinkType: "download"},
                        //{autoLinkId: "download_windows", autoLinkType: "download"},
                        //{autoLinkId: "download",customText:"WebApp"},
                        {autoLinkId: "KurzumrissGR", autoLinkType: "offsite"},
                        {autoLinkId: "Pflanzanbieter", autoLinkType: "offsite"},
                        {autoLinkId: "PflanzanbieterOffen", autoLinkType: "offsite"},
                        {autoLinkId: "CO2Verarbeitung", autoLinkType: "offsite"},
                        {autoLinkId: "CO2VerarbeitungOffen", autoLinkType: "offsite"},
                    ]
                },
                {
                    title: "Sonstige",
                    hidden: true
                }
            ];
            break;
        case "en"://Englisch
            unifooter = [
                {
                    title: "Quicklinks",
                    links: [
                        {autoLinkId: "home"},
                        {autoLinkId: "pinwall"},
                        {autoLinkId: "planting"},
                        //{autoLinkId: "download"},
                        {autoLinkId: "sources"},
                        {autoLinkId: "impressum"}
                    ]
                },
                {
                    title: "Social Media",
                    links: [
                        {autoLinkId: "youtube", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "Featuring",
                    links: [
                        //{autoLinkId: "matchofmemes", autoLinkType: "offsite"},
                        {autoLinkId: "soundriseproductions", autoLinkType: "offsite"},
                        //{autoLinkId: "luckyapps", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "Files (German)",
                    //titleLink: {autoLinkId: "download"},
                    links: [
                        //{autoLinkId: "download_documentation", autoLinkType: "download"},
                        //{autoLinkId: "download_windows", autoLinkType: "download"},
                        //{autoLinkId: "download",customText:"WebApp"},
                        {autoLinkId: "KurzumrissGR", autoLinkType: "offsite", customText:"Summary Greenery Calc."},
                        {autoLinkId: "Pflanzanbieter", autoLinkType: "offsite", customText:"Plantsupply"},
                        {autoLinkId: "PflanzanbieterOffen", autoLinkType: "offsite", customText:"Plantsupply Public"},
                        {autoLinkId: "CO2Verarbeitung", autoLinkType: "offsite", customText:"CO2 Processing"},
                        {autoLinkId: "CO2VerarbeitungOffen", autoLinkType: "offsite", customText:"CO2 Processing Public"},
                    ]
                },
                {
                    title: "Other",
                    hidden: true
                }
            ];
            break;
        case "ch"://Chinesisch
            unifooter = [
                {
                    title: "快速链接",
                    links: [
                        {autoLinkId: "home"},
                        {autoLinkId: "pinwall"},
                        {autoLinkId: "planting"},
                        //{autoLinkId: "download"},
                        {autoLinkId: "sources"},
                        {autoLinkId: "impressum"}
                    ]
                },
                {
                    title: "社交媒体",
                    links: [
                        {autoLinkId: "youtube", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "呈现",
                    links: [
                        //{autoLinkId: "matchofmemes", autoLinkType: "offsite"},
                        {autoLinkId: "soundriseproductions", autoLinkType: "offsite"},
                        //{autoLinkId: "luckyapps", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "下载",
                    //titleLink: {autoLinkId: "download"},
                    links: [
                        //{autoLinkId: "download_documentation", autoLinkType: "download"},
                        //{autoLinkId: "download_windows", autoLinkType: "download"},
                        //{autoLinkId: "download",customText:"WebApp"},
                        {autoLinkId: "KurzumrissGR", autoLinkType: "offsite", customText:"摘要绿化计算机"},
                        {autoLinkId: "Pflanzanbieter", autoLinkType: "offsite", customText:"植物供应商"},
                        {autoLinkId: "PflanzanbieterOffen", autoLinkType: "offsite", customText:"植物供应商公众"},
                        {autoLinkId: "CO2Verarbeitung", autoLinkType: "offsite", customText:"二氧化碳处理"},
                        {autoLinkId: "CO2VerarbeitungOffen", autoLinkType: "offsite", customText:"二氧化碳处理公众"},
                    ]
                },
                {
                    title: "其他",
                    hidden: true
                }
            ];
            break;
        default://Fallback
            unifooter = [
                {
                    title: "Quicklinks",
                    links: [
                        {autoLinkId: "home"},
                        {autoLinkId: "pinwall"},
                        {autoLinkId: "planting"},
                        //{autoLinkId: "download"},
                        {autoLinkId: "sources"},
                        {autoLinkId: "impressum"}
                    ]
                },
                {
                    title: "Social Media",
                    links: [
                        {autoLinkId: "youtube", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "Featuring",
                    links: [
                        //{autoLinkId: "matchofmemes", autoLinkType: "offsite"},
                        {autoLinkId: "soundriseproductions", autoLinkType: "offsite"},
                        //{autoLinkId: "luckyapps", autoLinkType: "offsite"}
                    ]
                },
                {
                    title: "Files",
                    //titleLink: {autoLinkId: "download"},
                    links: [
                        //{autoLinkId: "download_documentation", autoLinkType: "download"},
                        //{autoLinkId: "download_windows", autoLinkType: "download"},
                        //{autoLinkId: "download",customText:"WebApp"},
                        {autoLinkId: "KurzumrissGR", autoLinkType: "offsite"},
                        {autoLinkId: "Pflanzanbieter", autoLinkType: "offsite"},
                        {autoLinkId: "PflanzanbieterOffen", autoLinkType: "offsite"},
                        {autoLinkId: "CO2Verarbeitung", autoLinkType: "offsite"},
                        {autoLinkId: "CO2VerarbeitungOffen", autoLinkType: "offsite"},
                    ]
                },
                {
                    title: "Other",
                    hidden: true
                }
            ];
            break;
    }
}

function loadUniFooter(){
    try{
        if((typeof blockUniFooter == "undefined" || blockUniFooter == false ) && (typeof blockUniFooter == "undefined" || blockUniFooter != true)){
            var attributes = [["autoLink-id","autoLinkId"],["autoLink-type","autoLinkType"],["autoLink-lang","autoLinkLang"]];
            if(document.getElementsByTagName("footer")[0] && luckySite.settings.uniFooterSetHTML){
                //console.log("Footer da");
                document.getElementsByTagName("footer")[0].innerHTML = "";
                var HTMLString = '<section class="fLang"></section>'
                                +'<section class="fPath"></section>'
                                +'<section class="fLinks"></section>'
                                +'<section class="fFootnote">'
                                    +'<div class="fLegal">Copyright © <span class="currentYear"></span> luckySiteWERKE - All rights reserved.</div>'
                                    +'<div class="fVersion"><a class="autoLink" autoLink-id="updates"></a></div>'
                                +'</section>';
                document.getElementsByTagName("footer")[0].innerHTML = HTMLString;
                setFooterPath();
                setFooterLangs();
                setTextfields(); //Retoggle auto copyright year
            }
            var fLinks = document.getElementsByClassName("fLinks")[0];
            fLinks.innerHTML = "";
            for(i=0;i<unifooter.length;i++){
                if(unifooter[i].hidden == true){
                    continue;
                }
                var linklistHtml = "";
                if(unifooter[i].title){
                    var titleContent = "";
                    if(unifooter[i].titleLink != undefined && unifooter[i].titleLink != null){
                        var titleAttributes = "";
                        attributes.forEach(attribute => {
                            if(attribute[1] && unifooter[i].titleLink[attribute[1]] != undefined){
                                titleAttributes += attribute[0]+'="'+ unifooter[i].titleLink[attribute[1]] +'" ';
                            }
                        });
                        titleContent = "<a class='autoLink' "+ titleAttributes +" autoLink-keepText>"+ unifooter[i].title +"</a>";
                    }else{
                        titleContent = unifooter[i].title;
                    }
                    linklistHtml += "<div>"+ titleContent +"</div>";
                }
                if(unifooter[i].links != undefined){
                    unifooter[i].links.forEach((link)=>{ //Loop through Links
                        var autoLinkAttributes = "";
                        var autoLinkCustomText = "";
                        attributes.forEach((attribute)=>{ //Loop through UniFooter predefined attributes
                            if(attribute[1] && link[attribute[1]] != undefined){
                                autoLinkAttributes += attribute[0]+'="'+ link[attribute[1]] +'" ';
                            }
                        });
                        //apply link attribute effects
                        if(link.attribute!=undefined){ 
                            autoLinkAttributes += link.attribute;
                        }
                        if(link.customText != undefined && link.customText != null && link.customText != ""){
                            autoLinkAttributes += "autoLink-keepText";
                            autoLinkCustomText = link.customText;
                        }

                        linklistHtml += '<a class="autoLink" '+ autoLinkAttributes +'>'+ autoLinkCustomText +'</a>';
                    });
                }
                fLinks.innerHTML += '<div class="fLinklist">'+ linklistHtml +'</div>';
            }
            setAutoLinks();
            //console.log("uniFooter geladen");
        }else{
            console.warn("UniFooter wurde blockiert");
        }
    }catch{
        console.warn("Laden des UniFooters ist fehlgeschlagen. Der Footer wird möglicherweise nicht richtig angezeigt oder ist nicht verfügbar.");
    }
}

function setAutoNavbar(){
    try{
        var navbarElements = linkmanager.pageData.navbar;
        if(document.getElementsByTagName("nav")){
            var nav = document.getElementsByTagName("nav")[0];
            var navChilds = nav.children;
            if(navbarElements.length != 0){
                nav.innerHTML = '<div id="closeNav">X</div>';
                for(i=0;i<navbarElements.length;i++){
                    if(navbarElements[i]=="home"){
                        nav.innerHTML += "<img  alt='Home | luckySite Logo' src='/media/Logo_Idee_6.png' class='autoLink' autoLink-type='onsiteNOa' autoLink-Id='"+ navbarElements[i] +"'></img>"
                    }else{
                        nav.innerHTML += "<a class='autoLink nava' autoLink-type='onsite' autoLink-Id='"+ navbarElements[i] +"'></a>";
                    }
                }
            }
        }
    }catch(err){
        console.warn("Beim erstellen der AutoNavbar ist ein Fehler aufgetreten.")
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

