window.addEventListener("load", initLuckySite);

//Ladebildschirm setzen
document.body.innerHTML += "<div id='loadingScreen' style='position:fixed;top:0;left:0;width:100vw;height:100vh;backdrop-filter: blur(6px);z-index:999'></div>";

luckySite = {
    version: "va.25061.0"
};

scriptFileList = [
    "/scripts/cookies/cookies.js",
    "/sitemap.js",
    "/scripts/linkmanager.js",
    "/scripts/settings.js",
    "/scripts/lang.js",
    "/ui/alertBox/alertBox.js",
    "/ui/uiMainControl.js",
    "/ui/darkmode/darkmode.js",
    "/ui/navbar/navbar.js"
];

stylesheetFileList = [
    "/ui/darkmode/darkmode.css",
    "/dokumentation/dokumentation.css",
    "/ui/footer.css",
    "/ui/mainStyle.css",
    "/ui/navbar/navbar.css"
];

loadEmbeddedScripts(scriptFileList);

loadEmbeddedStyles(stylesheetFileList);

async function initLuckySite(){//App startpunkt
    //luckySite = await getData("/scripts/metadata.json");

    initSettings();
    luckySite.loadSettings();

    init_cookies();

    initlang();

    start_error_stylesheet() //alertBox --> Muss noch überarbeitet werden

    await linkmanager.load();

    initUi();

    await sleep(100);
    document.getElementById("loadingScreen").style.display = "none";

    console.log("Fertig!");
}