
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
                        fPath.innerHTML += "<a href='"+ sitemap[currentParent][linkmanager.pageData.lang].link +"'><div>"+ sitemap[currentParent][linkmanager.pageData.lang].name +"</div></a>";
                    }
                    var pathDivider = "<div>/</div>"; // Trennzeichen
                    fPath.innerHTML += pathDivider;
                }
            }
            fPath.innerHTML += "<a href='"+ linkmanager.pageData.data.link +"'><div>"+ linkmanager.pageData.data.name +"</div></a>";
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

async function initUniFooter(){ //Inhalt des Footers laden
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
                        {autoLinkId: "documentation"},
                        {autoLinkId: "test"}
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
                        {autoLinkId: "documentation"},
                    ]
                },
                {
                    title: "Other",
                    hidden: true
                }
            ];
            break;
        default://Fallback
            unifooter = [
                {
                    title: "Schnellverweis",
                    links: [
                        {autoLinkId: "home"},
                        {autoLinkId: "documentation"},
                    ]
                },
                {
                    title: "Sonstige",
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
                                    +'<div class="fLegal">Copyright © <span class="currentYear"></span> LuckyApps - All rights reserved.</div>'
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
    }catch(err){
        console.error(err);
        console.warn("Laden des UniFooters ist fehlgeschlagen. Der Footer wird möglicherweise nicht richtig angezeigt oder ist nicht verfügbar.");
    }
}