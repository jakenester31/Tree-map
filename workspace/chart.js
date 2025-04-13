var sbh_md;

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
        document.getElementById("sbh").style.left= mx - 5 + "px";
        document.getElementById("sidebar").style.width= mx + "px";
        document.getElementById("w_container").style.left= mx + "px";
        document.getElementById("sidebar").style.backgroundColor= "skyblue";
    } else { // mouse is not moving
        document.getElementById("sidebar").style.backgroundColor= "white";
    }
});