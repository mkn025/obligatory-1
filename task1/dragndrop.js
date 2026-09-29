 



export function testerFunctions(box,a,b) {
    box.style.left =  "500px";
    box.style.top  =  "500px";
    }


export function* dragndrop(box) {
    let isKeyDown = false;
    while (true) {
        let evt = yield;
        if (evt.type == "mousedown") {
            isKeyDown = true;
        } else if (evt.type == "mouseup") {
            isKeyDown = false;
        }
        if (evt.type == "mousemove" && isKeyDown) {
            move(box, evt);
        }
    }
}




export function move(box, event) {

  box.style.left = (event.pageX - box.parentNode.offsetLeft) + "px";
  box.style.top  = (event.pageY - box.parentNode.offsetTop)  + "px";

}
export function checkGoal(box, goal) {

    let b = box.getBoundingClientRect();
    let g = goal.getBoundingClientRect();

    let overlaps = !(
    b.right  < g.left  ||
    b.left   > g.right ||
    b.bottom < g.top   ||
    b.top    > g.bottom
    );


    goal.classList.toggle('celebrate', overlaps);
    goal.textContent = overlaps ? `🎉 You did it, Martin! ${Date.now()} 🎉` : "";

}


