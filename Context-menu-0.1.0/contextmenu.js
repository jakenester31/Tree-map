// General
document.querySelector('head').insertAdjacentHTML('beforeend','<link href="../Context-menu-0.1.0/contextmenu.css" rel="stylesheet">');
const container = document.documentElement.appendChild(document.createElement('contextMenu'));
const settings = {state:1,autoCloseChild:1,childClickSwitch:0};
const allMenus = [];
const placeHolder = menuStart(''); //Place holder, don't remove
var defaultMenu;
var hover = 0;
const ms = [0,0];
var openChild;

// Menus

menuStart('all');
addButton('Hello!');


//functions

// menu creation functions
function menuStart(...selector) {
    const element = document.createElement('div');
    const sel = [];
    for (var i = 0; i < selector.length; i++){
        if (selector[i][0] == '#'){
            const tn = selector[i].slice(1);
            const index = allMenus.find(e => 
                e => e.classList.indexOf('ctm_' + tn) > -1
            )
            if (index != undefined){
                element.id = 'ctmc_' + tn;
            }
        } else {
            sel.push(selector[i]);
        }
    }
    element.className = "menu";
    allMenus.push([element,sel]);
    typeof menu == 'undefined' && (menu = element);
    selector.includes('all') && (defaultMenu = element); //set default menu
    container.appendChild(element);
    return(element);
}

function addButton(txt,onclick,icon,parent){
    if (allMenus.length == 1) {
        console.error('Place Holder menu cannot have items');
        return(0);
    }
    const element = document.createElement('button');
    icon == 'sm' && (icon = txt);
    icon != undefined && (element.classList.add("ico"),element.style.setProperty('--icon', 'url(menu-ico/' + icon +'.png)'));
    const menu = container.lastChild.id;
    if (menu.slice(0,5) != "ctmc_") {
        parent != undefined && element.classList.add("parent","ctm_" + parent);
    }
    element.innerHTML = txt;
    element.onclick = new Function(onclick);
    document.querySelector('contextMenu').lastChild.appendChild(element);
}

function cmt (txt) {
    document.querySelector('contextMenu').appendChild(document.createComment(txt));
}

// Child menu functions
function childOpen(e) {
    const child = findChild(e);
    openChild = child;
    openChild.classList.add('open');
    // info
    const button = e.target.getBoundingClientRect(); //parent button
    const target = openChild.getBoundingClientRect(); //child menu
    // position
    const pos = {x:0,y:0};
    // x axis
    pos.x = button.right;
    if (pos.x + openChild.clientWidth > document.documentElement.clientWidth){
        pos.x = button.left - target.width;
        if (button.left < document.documentElement.clientWidth - button.right) {
            pos.x = button.right;
        }
    }
    // experimental x-axis
    pos.x < 0 && (pos.x = 0);
    if (pos.x + target.width > document.documentElement.clientWidth) {
        pos.x = document.documentElement.clientWidth - target.width;
    }
    // y axis
    pos.y = button.top - 10;
    if (pos.y + target.height > document.documentElement.clientHeight){
        pos.y = document.documentElement.clientHeight - target.height;
    }
    // set pos
    openChild.style.left = pos.x + 'px'
    openChild.style.top = pos.y + 'px'
}

function findChild (e){
    var id;
    // get child menu
    for (var i = 0; i < e.target.classList.length; i++){
        if (e.target.classList[i].includes('ctm_')){
            id = '#ctmc_' + e.target.classList[i].slice(4);
            i = e.target.classList.length;
        }
    }
    return(document.querySelector(id));
}

function hideChild(){
    if (openChild != undefined){
        openChild.classList.remove('open');
    }
}

//Listeners
addEventListener('contextmenu', e => {
    // is menu on?
    if (settings.state != 1){
        return(0);
    }
    // old menu Guard
    if (menu != undefined){
        menu.style.left = '';
        menu.classList.remove('open');
    }
    hideChild();
    // new menu info

    menu = undefined;
    // Default selector
    typeof defaultMenu != 'undefined' && (menu = defaultMenu);
    // element selector
    var element = document.elementFromPoint(e.clientX, e.clientY); //Element type
    if (element == undefined){
        console.error('No element... Out of bounds?');
        menu = placeHolder;
        menu.classList.add('open');
        return(0);
    } else {
        element = element.nodeName;
    }
    const index = allMenus.find(e => (e[1].find(
        e => e.toUpperCase() == element.toUpperCase()
    )))
    typeof index != 'undefined' && (menu = index[0]);
    // state selector
    for (var i = 0; i < allMenus.length; i++){
        for (var a = 0; a < allMenus[i][1].length; a++){
            if (allMenus[i][1][a][0] == '?') {
                const foo = Function(`{
                    if (${allMenus[i][1][a].slice(1)}){
                        menu = allMenus[${i}][0];
                    }
                }`);
                foo();
            }
        }
    }
    // record mouse
    ms.splice(0,1);
    ms.push([e.clientX,e.clientY]);
    // Cancel if no menu or mouse still
    if (menu == undefined || ms[0].toString() == ms[1].toString()) {
        menu = placeHolder;
        menu.classList.add('open');
        return(0)
    }

    e.preventDefault();
    menu.classList.add('open');

    // Calc menu position

    // set menu position
    const mdm = [menu.clientWidth,menu.clientHeight], wdm = [document.documentElement.clientWidth,document.documentElement.clientHeight], mp = [e.clientX,e.clientY], pos = [];
    for (var i = 0; i < 2; i++){
        // calc
        pos.push(mp[i] + mdm[i] > wdm[i] ? mp[i] - mdm[i] : mp[i]); // set menu position, standard context menu
        pos[i] < 0 && (pos[i] = mp[i] + mdm[i] > wdm[i] ? mp[i] - mdm[i] / 2 : mp[i]); // custom: no space? mouse center
        (pos[i] < 0 || pos[i] + mdm[i] > wdm[i]) && (pos[i] = wdm[i] / 2 - mdm[i] / 2); // custom: still no space? screen center
        // Result
        menu.style[['left','top'][i]] = pos[i] + "px";
    }
})

addEventListener('mousedown', e => {
    if (menu == undefined){
        console.log('click, no menu')
        return(0);
    }    
    if (hover != 2 && e.target != menu) {
        menu.classList.remove('open');
        hideChild();
    }
    if(settings.childClickSwitch != 1){
        return(0);
    }
    if (findChild(e) != null && menu.matches('.open')){
        if (Array.from(findChild(e).classList).indexOf('open') > -1){
            hideChild();
        } else {
            childOpen(e);
        }
    }
})


// Prevent Page from scrolling when mouse is over menu
{
    // Ignore wheel
    addEventListener('wheel', e => {
        if (hover == 0){
            if (menu == undefined){
                return(0);
            }  
            menu.classList.remove('open');
            // Hover Guard
            hover = 0;
            hideChild();
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    }, {passive: false})

    // Ignore Key
    const lock = [];
    const ignore = [' ','ArrowDown','ArrowUp','ArrowLeft','ArrowRight','PageDown','PageUp','End'];
    addEventListener('keydown', e=> {
        key = e.key;
        if (lock.indexOf(e.key) == -1){
            lock.push(e.key);
            if (ignore.indexOf(e.key) > -1 && hover > 0) {
                e.preventDefault();
            }
        }
    })
    addEventListener('keyup', e=>{
        lock.splice(lock.indexOf(e.key),1);
    })
    
    // Final layer, has slight delay
    // But it works for everything
    const pgOff = [];
    pgOff.push([window.scrollX,window.scrollY]);
    pgOff.push([window.scrollX,window.scrollY]);

    addEventListener('scroll', e=>{
        if (Array.from(menu.classList).indexOf('open') > -1){
            if (hover > 0) {
                scroll(...pgOff[0]);
                scrollTo(...pgOff[0]);
            } else {
                menu.classList.remove('open');
                hideChild();
            }
        } else {
            pgOff.splice(0,1);
            pgOff.push([window.scrollX,window.scrollY]);
        }
    })
}

addEventListener('transitionend', e => {
    const obj = e.target;
    if (Array.from(obj.classList).indexOf('menu') == -1){
        return(0);
    }
    const op = getComputedStyle(obj).opacity;
    if (op == 0){
        obj.style.left = '';
    }
})

{
    // Hover over menu?
    function setHover(n){
        hover = n;
    }
    for (var i = 0; i < allMenus.length; i++){
        allMenus[i][0].addEventListener('mouseenter', e => setHover(1),false);
        allMenus[i][0].addEventListener('mouseleave', e => setHover(0),false);
        if (allMenus[i][0].id.includes('ctmc_')){
            allMenus[i][0].addEventListener('mouseenter', e => {
                setHover(3);
            });
            allMenus[i][0].addEventListener('mouseleave', e => {
                hide();
            });
        }
    }
    // Hover over parent button?
    const elements = document.getElementsByClassName('parent');
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener('mouseenter', e => {
            hover = 2;
            if (e.target.parentNode.matches('.open')){
                hideChild();
                childOpen(e);
            }
        })
        elements[i].addEventListener('mouseleave', e=> setTimeout(hide,1));
        function hide(){
            if (settings.autoCloseChild == 1 && hover != 3){
                hideChild();
            }
            hover = 1;
        }
    }
}