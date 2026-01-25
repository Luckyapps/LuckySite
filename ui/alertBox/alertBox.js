var error_container;

async function start_error_stylesheet(){
    var html_content = '<div class="error_style_container"><div id="error_container" class="error_hidden"></div></div>';
    html_content = createHTML(html_content);
    //console.log(html_content);
    document.body.appendChild(html_content);
    load_error_stylesheet();
}

function load_error_stylesheet(){
    cssLoader("/ui/alertBox/alertBox.css");
}

var error = {};

error.show = function (error_info, error_type){   
    error_container = document.getElementById("error_container");
    if(error_type == "closed"){ //vorgefertigter Typ
        error_container.innerHTML = "Keine Verbindung zum Server möglich. <br>Bitte später noch einmal versuchen oder Seite neu Laden.";
    }else if(error_type == "info_load"||error_type == "info"){
        error_container.innerHTML = error_info;
        error_container.classList.add("error_info");
    }else if(error_type == "success"){
        error_container.innerHTML = error_info;
        error_container.classList.add("error_success");
    }else{
        error_container.innerHTML = error_info;
    }
    error_container.classList.add("fade_in_out");
    var timeout_duration = parseFloat(window.getComputedStyle(error_container).animationDuration) * 1000;
        setTimeout(function() {   
            error_container.classList.remove("fade_in_out");
            error_container.classList = "error_hidden";
            }, timeout_duration); 
}

var info = {}

info.show = function(info_info, info_type){
    if(info_type){
        error.show(info_info, info_type);
    }else{
        error.show(info_info, "info_load");
    }
}

function info_hide(){
    error_container.classList = "error_hidden";
}