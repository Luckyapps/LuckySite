window.addEventListener("load", initLuckySite);

//Ladebildschirm setzen
document.body.innerHTML += "<div id='loadingScreen' style='position:fixed;top:0;left:0;width:100vw;height:100vh;background:green;z-index:999'></div>";

luckySite = {};

scriptFileList = [
    "/scripts/cookies/cookies.js",
    "/sitemap.js",
    "/scripts/linkmanager.js",
    "/scripts/settings.js",
    "/scripts/lang.js",
    "/ui/alertBox/alertBox.js",
    "/ui/uiMainControl.js",
    "/ui/darkmode/darkmode.js"
];

stylesheetFileList = [
    "/ui/darkmode/darkmode.css",
    "/dokumentation/dokumentation.css"
];

loadEmbeddedScripts(scriptFileList);

loadEmbeddedStyles(stylesheetFileList);

async function initLuckySite(){//App startpunkt
    luckySite = await getData("/scripts/metadata.json");

    initSettings();
    luckySite.loadSettings();

    init_cookies();

    initlang();

    start_error_stylesheet() //alertBox --> Muss noch überarbeitet werden

    linkmanager.load();

    document.getElementById("loadingScreen").style.display = "none";

    console.log("Fertig!");
}