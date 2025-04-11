var workspace = document.getElementById("workspace");
const sbh = document.getElementById("sbh");
const body = document.getElementsByTagName("body")[0];
var mx;
var sbh_md;


sbh.addEventListener("mousedown", (event) => {   //Mouse Down?
    sbh_md = 1;
});

addEventListener("mouseup", (event) =>{ //Mouse up?
    sbh_md=0;
});

addEventListener('mouseleave',(event) => { //Mouse leave document?
    sbh_md = 0;
});

addEventListener('mousemove',(event) => { //Mouse Move?
    mx = event.clientX;
    if (sbh_md == 1){
        let x = mx
        mx < 50 && (x = 50); //min size
        mx > 200 && (x = 200); //max size
        sbh.style.left= x - 5 + "px";
        document.getElementById("sidebar").style.width=x + "px";
        document.getElementById("w_container").style.left= x + "px";
        document.getElementById("sidebar").style.backgroundColor="skyblue";
    } else {
        document.getElementById("sidebar").style.backgroundColor="white";
    }
});