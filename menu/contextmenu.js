document.getElementsByTagName('box')[0].innerHTML += `
<div class="menu" id="menu1" style="left:-1000px">
    <div class="main">
        <button onclick="console.log('b1')">
            <p>Button 1</p>
        </button>
        <button>
            <p>Button 2</p>
        </button>
        <button>
            <p>Button 3</p>
        </button>
        <button>
            <p>Button 4</p>
         </button>
         <button>
            <p>Button 5</p>
         </button>
         <button>
            <p>Button 6</p>
         </button>
    </div>
</div>

<div class="menu" id="menuIMG" style="left:-1000px">
    <div class="main">
        <button onclick="this.firstElementChild.setAttribute('href',element.src)">
            <a href="" download>
                <p>Save img</p>
            </a>
        </button>
        <button onclick="this.firstElementChild.setAttribute('href',element.src)">
            <a target="_blank" rel="noopener noreferrer">
                <p>Open image in new tab</p>
            </a>
        </button>
        <button>
            <p>Button 4</p>
        </button>
        <button>
            <p>Button 5</p>
         </button>
        <button>
            <p>Button 6</p>
        </button>
    </div>
</div>

<div class="menu" id="menuCANVAS" style="left:-1000px">
    <div class="main">
        <button>
            <p>Settings</p>
        </button>
        <button>
            <p>Button 5</p>
         </button>
        <button>
            <p>Button 6</p>
        </button>
    </div>
</div>

<div class="menu" id="menuCANVAS2" style="left:-1000px">
    <div class="main">
        <button>
            <p>Add node</p>
        </button>
        <button>
            <p>Add to group</p>
        </button>
        <button onclick="console.log(123)">
            <p>lock movement</p>
         </button>
        <button>
            <p>Delete</p>
        </button>
    </div>
</div>
`;

const menu1 = document.getElementById('menu1');
const menuIMG = document.getElementById('menuIMG');
const menuCANVAS = document.getElementById('menuCANVAS');
const menuCANVAS2 = document.getElementById('menuCANVAS2');
var menu = menu1;
var element;
addEventListener('contextmenu',e =>{
    e.preventDefault(); //stops normal menu;
    // get new menu type and element under
    menu.style.display="none"; //stop detection (turn off)
    element = document.elementFromPoint(e.clientX, e.clientY); //get element
    menu.style.display="block"; //turn on
    //last menu guard
    menu.classList.remove('open'); 
    menu.style.pointerEvents='none';
    //new menu
    menu = menu1; // default menu
    element.nodeName == 'IMG' && (menu = menuIMG); //img menu
    element.nodeName == 'CANVAS' && (menu = menuCANVAS); //canvas menu
    element.nodeName == 'CANVAS' && touch.length > 0 &&(menu = menuCANVAS2); //object menu in canvas
    console.log(element.nodeName); // [delete me]
    //new menu settings
    menu.classList.add('open');
    menu.style.pointerEvents='auto';
    //new menu position
    let x = e.clientX + menu.clientWidth > window.innerWidth ? e.clientX - menu.clientWidth : e.clientX;
    let y = e.clientY + menu.clientHeight > window.innerHeight ? e.clientY - menu.clientHeight : e.clientY;
    menu.style.left= x + "px";
    menu.style.top= y + "px";
});

addEventListener("mousedown", function() {
    if (menu.matches('.open:not(:hover)')){
        document.getElementsByTagName('html')[0].style.pointerEvents='none';
        menu.style.pointerEvents='none';
        menu.classList.remove('open');
    }
})

addEventListener('mouseup',function(){
    if (window.getComputedStyle(document.getElementsByTagName('html')[0]).getPropertyValue("pointer-events") == 'none') {
        document.getElementsByTagName('html')[0].style.pointerEvents='auto';
    }
})

document.getElementsByTagName('box')[0].addEventListener('click', function() {
    menu.style.pointerEvents='none';
    menu.classList.remove('open');
})

addEventListener('wheel',function() {
    if (menu.matches('.open:not(:hover)')){
        menu.style.pointerEvents='none';
        menu.classList.remove('open');
    }
})

addEventListener('transitionend', e => {
    if (getComputedStyle(e.target).getPropertyValue('opacity') == 0) {
        e.target.style.left= "-1000px";
        e.target.style.top= "-1000px";
    }
})