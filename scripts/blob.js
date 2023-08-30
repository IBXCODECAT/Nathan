const blob = document.getElementById("blob");

document.body.onpointermove = event => {
    const { clientX, clientY } = event;

    //Animate blob to follow pointer with delay
    //Do not reset animation after completion
    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" })
}