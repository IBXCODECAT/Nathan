//Imagine there is a slider across the screen and dragging it back and forth controls the track
//This slider is extra fancy because it is completely invisible and always follows the mouse around
//before each click

const track = document.getElementById("image-track");

//Listen for any mouse down event and keep track of the X position the mouse was down at
//We can then use this as the starting point for our invisible slider
//We are storing this in the html dataset for this page element

const handleOnDown = event => track.dataset.mouseDownAt = event.clientX;

//We need a way to know how far our mouse has traveled relative to the staring point calculated from
//mouse down as well as a way to determine where the maxDelta (other end) of our slider should be.
const handleOnMove = () => {

    //If the mouse has not been clicked down yet, we don't need to do anything
    if (track.dataset.mouseDownAt === "0") return;

    //Calculate the relative and maximum distances from the starting point
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - event.clientX,
        maxDelta = window.innerWidth / 2;

    //Calculate the percentage of the slider that has been traversed and calculate the new position
    //of the slider relative to the traversal percentage
    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    //Constantly update the previous percentage so we can keep track of it for the next mouse move
    track.dataset.percentage = nextPercentage;

    //Move the elements to the new position
    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
      }, { duration: 1200, fill: "forwards" });
}

//Listen for any mouse up event and reset the starting point for our invisible slider
const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage | "0";
}

/* -- Extra lines for touch events -- */
window.onmousedown = event => handleOnDown(event);
window.ontouchstart = event => handleOnDown(event.touches[0]);
window.onmouseup = event => handleOnUp(event);
window.ontouchend = event => handleOnUp(event.touches[0]);
window.onmousemove = event => handleOnMove(event);
window.ontouchmove = event => handleOnMove(event.touches[0]);