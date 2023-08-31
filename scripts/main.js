
//Disable element dragging
document.ondragstart = event => {
  return false;
};

//Disable right click and context menu
document.addEventListener('contextmenu', event => event.preventDefault());