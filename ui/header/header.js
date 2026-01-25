window.addEventListener("load",resizeHeader);
window.addEventListener("resize",resizeHeader);

var headerResizeCount = 0;

function resizeHeader(){ //Funktion ohne js durch setzen von height = 100vh in header
    return;
    //console.log("resize");
    headerResizeCount++;
    if(document.getElementsByTagName("header")[0]){
        var header = document.getElementsByTagName("header")[0];
        header.style.height = window.innerHeight +"px";
    }else{
        console.warn("Kein Header vorhanden.");
    }
}