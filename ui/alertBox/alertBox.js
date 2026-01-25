var alertBox_container;

async function start_alertBox_stylesheet(){
    var html_content = '<div class="alertBox_style_container"><div id="alertBox_container" class="alertBox_hidden"></div></div>';
    html_content = createHTML(html_content);
    document.body.appendChild(html_content);
    cssLoader("/ui/alertBox/alertBox.css");
}

var alertBox = {};

alertBox.show = function (alertBox_info, alertBox_type){   
    alertBox_container = document.getElementById("alertBox_container");
    if(alertBox_type == "closed"){ //vorgefertigter Typ
        alertBox_container.innerHTML = "Keine Verbindung zum Server möglich. <br>Bitte später noch einmal versuchen oder Seite neu Laden.";
    }else if(alertBox_type == "info_load"||alertBox_type == "info"){
        alertBox_container.innerHTML = alertBox_info;
        alertBox_container.classList.add("alertBox_info");
    }else if(alertBox_type == "success"){
        alertBox_container.innerHTML = alertBox_info;
        alertBox_container.classList.add("alertBox_success");
    }else{
        alertBox_container.innerHTML = alertBox_info;
    }
    alertBox_container.classList.add("fade_in_out");
    var timeout_duration = parseFloat(window.getComputedStyle(alertBox_container).animationDuration) * 1000;
        setTimeout(function() {   
            alertBox_container.classList.remove("fade_in_out");
            alertBox_container.classList = "alertBox_hidden";
            }, timeout_duration); 
}

var info = {}

info.show = function(info_info, info_type){
    if(info_type){
        alertBox.show(info_info, info_type);
    }else{
        alertBox.show(info_info, "info_load");
    }
}

function info_hide(){
    alertBox_container.classList = "alertBox_hidden";
}