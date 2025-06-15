//Diese Datei enthält Utility-Funktionen (Hilfsfunktionen)

async function loadFunction(functionName){//Versuche eine Funktion des Namens "functionName" zu laden (bricht nach 10000ms ab)
    for(i=0;i<100;i++){
        if(typeof window[functionName] == "function"){
            window[functionName]();
            return true;
        }else{
            await sleep(100);
        }
    }
    console.warn(`Funktion ${functionName} konnte nicht geladen werden.`)
    return false;
}

async function loadEmbeddedStyles(list){
    await list.forEach(async(elem)=>{cssLoader(elem)});
}

async function loadEmbeddedScripts(list){
    await list.forEach(async(elem)=>{await scriptLoader(elem)});
}

async function loadEmbeddedFunctions(list){
    list.forEach((elem)=>{loadFunction(elem)});
}

async function getAbsoluteLink(link){
    if(window.location.origin != "file://"){
        return window.location.origin +"/"+ link;
    }
}

function Werteliste (querystring) { //Urldaten Abrufen
    if (querystring == '') return;
    var wertestring = querystring.slice(1);
    var paare = wertestring.split("&");
    var paar, name, wert;
    for (var i = 0; i < paare.length; i++) {
      paar = paare[i].split("=");
      name = paar[0];
      wert = paar[1];
      name = unescape(name).replace("+", " ");
      wert = unescape(wert).replace("+", " ");
      this[name] = wert;
    }
}
var urlData = new Werteliste(location.search);

async function getData(url, noinfo){ //Daten im JSON format aus externer Quelle abrufen
    var data

    if(!url.includes("https")){ //URL automatisch auf https updaten
        if(url.includes("http")){
            url = url.replace("http","https");
            //console.log(url);
        }
    }else{
        //console.log(url);
    }
    
    await fetch(url)
        .then((response) => response.text())
        .then((data_text) => {data = JSON.parse(data_text)});

    return data;
}

function sleep(ms) { //Sleep funktion, wird ausgelöst mit: await sleep(ms) !!Aufrufende funktion muss asynchron sein!!
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function scriptLoader(path, callback, callback_alt){ //Ein JS script einbetten, optionen eine callback funktion aufzurufen (callback: Type Function; callback_alt: Type String(funktionsname) )
    return new Promise(async(resolve)=>{
        var script = await document.createElement('script');
        script.type = "text/javascript";
        //script.async = true;
        script.src = path;
        script.onload = new Promise(async (resolve)=>{  
            if(!callback){
                if(callback_alt){
                    console.log("alt")
                    callback = window[callback_alt];
                }
            }
            if(typeof(callback) == "function"){
                await callback();
            }
            //console.log(linkmanager)
            resolve();
        });
        try{
            var scriptOne = document.getElementsByTagName('script')[0];
            scriptOne.parentNode.insertBefore(script, scriptOne);
        }
        catch(e){
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        resolve();
    })
}

function cssLoader(file, callback){ //Ein CSS stylesheet einbetten
    var link = document.createElement("link");
    link.href = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    link.onload = function(){
        if(typeof(callback) == "function"){
            callback();
        }
    }
}

function createHTML(htmlString) { //HTML element erstellen (String zu HTML-Element)
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }