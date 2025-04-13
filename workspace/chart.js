var sbh_md;
resize_sidebar(localStorage.getItem("x"));
sbh.addEventListener("mousedown", function(){   //Mouse Down?
    sbh_md = 1;
});

addEventListener("mouseup", function(){ //Mouse up?
    sbh_md=0;
});

addEventListener('mouseleave', function(){ //Mouse leave document?
    sbh_md = 0;
});

addEventListener('mousemove',(event) => { //Mouse Move?
    if (sbh_md == 1){ // Mouse is down and moving
        let mx = event.clientX;
        mx < 50 && (mx = 50); //min size
        mx > 200 && (mx = 200); //max size
        localStorage.setItem("x",mx);
        resize_sidebar(mx);
    } else { // mouse is not moving
        document.getElementById("sidebar").style.backgroundColor= "white";
    }
});

function resize_sidebar(x){
    document.getElementById("sbh").style.left= x - 5 + "px";
    document.getElementById("sidebar").style.width= x + "px";
    document.getElementById("w_container").style.left= x + "px";
    document.getElementById("sidebar").style.backgroundColor= "skyblue";
}