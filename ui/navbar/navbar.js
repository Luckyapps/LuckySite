var navbarBackground = false;
var navIsOpen = false;
var langPopupOpen = false;

window.addEventListener("scroll",(evt)=>{
    var nav = document.getElementsByTagName("nav")[0];
    if(window.scrollY > 100){
        if(!navbarBackground){
            nav.classList.add("navBackground");
            navbarBackground = true;
        }
    }else{
        if(navbarBackground){
            nav.classList.remove("navBackground");
            navbarBackground = false;
        }
    }
});

function loadNavbar(){
    if(document.getElementById("closeNav")==undefined || document.getElementById("navBurger") == undefined){
        console.warn("Keine Navbar-Steuerelemente verfügbar.");
        return;
    }
    document.getElementById("closeNav").addEventListener("click",()=>{
        if(navIsOpen){
            document.getElementsByTagName("html")[0].classList.remove("noscroll");
            document.getElementsByTagName("nav")[0].classList.remove("mobileNavOpen")
            document.getElementsByTagName("nav")[0].classList.add("mobileNavClose");
            navIsOpen = false;
        }
    });
    document.getElementById("navBurger").addEventListener("click",()=>{
        if(!navIsOpen){
            document.getElementsByTagName("html")[0].classList.add("noscroll");
            document.getElementsByTagName("nav")[0].classList.remove("mobileNavClose")
            document.getElementsByTagName("nav")[0].classList.add("mobileNavOpen");
            navIsOpen = true;
        }
    });
    //Buttonverkleinerung bei Mousedown und Touch
    document.getElementById("navBurger").addEventListener("mousedown",()=>{ 
        document.getElementById("navBurger").classList.add("navBurger_pressed");
    });
    document.getElementById("navBurger").addEventListener("mouseup",()=>{
        document.getElementById("navBurger").classList.remove("navBurger_pressed");
    });
    document.getElementById("navBurger").addEventListener("touchstart",()=>{
        document.getElementById("navBurger").classList.add("navBurger_pressed");
    });
    document.getElementById("navBurger").addEventListener("touchend",()=>{
        document.getElementById("navBurger").classList.remove("navBurger_pressed");
    });
    document.getElementById("closeNav").addEventListener("mousedown",()=>{
        document.getElementById("closeNav").classList.add("closeNav_pressed");
    });
    document.getElementById("closeNav").addEventListener("mouseup",()=>{
        document.getElementById("closeNav").classList.remove("closeNav_pressed");
    });
    document.getElementById("closeNav").addEventListener("touchstart",()=>{
        document.getElementById("closeNav").classList.add("closeNav_pressed");
    });
    document.getElementById("closeNav").addEventListener("touchend",()=>{
        document.getElementById("closeNav").classList.remove("closeNav_pressed");
    });
    //Sprachpopup
    if(document.getElementById("settings_lang")){
        document.getElementById("settings_lang").addEventListener("click",()=>{
            document.getElementById("settings_popup_lang").classList.toggle("invisible");
        });
    }
};

window.addEventListener("resize",(evt)=>{
    if(window.innerWidth>650){
        document.getElementsByTagName("nav")[0].classList.remove("mobileNavOpen");
        document.getElementsByTagName("nav")[0].classList.remove("mobileNavClose");
        document.getElementsByTagName("html")[0].classList.remove("noscroll");
    }
});