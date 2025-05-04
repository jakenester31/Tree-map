var sbh_md;

// saves sidebar width
// if (localStorage.getItem("sbx") != undefined){
//     resize_sidebar(localStorage.getItem("sbx"));
// }

sbh.addEventListener("mousedown", function(){   //Mouse Down?
    sbh_md = 1;
});

addEventListener("mouseup", function(){ //Mouse up?
    sbh_md=0;
});

addEventListener('mousemove',(event) => { //Mouse Move?
    if (sbh_md == 1){ // Mouse down
        let mx = event.clientX;
        mx < 50 && (mx = 50); //min size
        mx > 200 && (mx = 200); //max size
        localStorage.setItem("sbx",mx); //store
        resize_sidebar(mx);
    }
});

function resize_sidebar(x){
    document.getElementById("sbh").style.left = x - 5 + "px";
    document.getElementById("sidebar").style.width = x + "px";
    document.getElementById("w_container").style.left = x + "px";
}