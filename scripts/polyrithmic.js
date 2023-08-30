const paper = document.getElementById("paper"),
      pen = paper.getContext("2d");

const get = selector => document.querySelector(selector);

const toggles = {
  sound: get("#sound-toggle")
}

// Use whatever colors you want
// https://unsplash.com/photos/tZCrFpSNiIQ
 const colors = [
   "#00D7EF",
   "#01D9E9",
   "#01DBE3",
   "#02DDDD",
   "#03DFD7",
   "#03E1D1",
   "#04E3CB",
   "#04E5C5",
   "#05E7BF",
   "#06E9B9",
   "#06EBB3",
   "#07EDAD",
   "#08EFA8",
   "#08F0A3",
   "#09F29E",
   "#09F499",
   "#0AF594",
   "#0AF78F",
   "#0BF88A",
   "#0BFA85",
   "#0CFC80"
];

colors.reverse();

// Here I'm using the same color for all 21 arcs
//const colors = Array(21).fill("#A6C48A");

const settings = {
  startTime: new Date().getTime(), // This can be in the future
  duration: 900, // Total time for all dots to realign at the starting point
  maxCycles: Math.max(colors.length, 100), // Must be above colors.length or else...
  soundEnabled: false, // User still must interact with screen first
  pulseEnabled: true, // Pulse will only show if sound is enabled as well
}

const handleSoundToggle = (enabled = !settings.soundEnabled) => {  
  settings.soundEnabled = enabled;
  toggles.sound.dataset.toggled = enabled;
}

document.onvisibilitychange = () => handleSoundToggle(false);

paper.onclick = () => handleSoundToggle();

//Get the Audio Files required to play the polyrithmic waves
//Also log the files to the console
console.group("Polyrithmic Key Files");
const keys = colors.map((color, index) => {
    
    //*.wav files won't be referenced in page sources per chrome dev tools so we must use the raw repo url
    const file = `https://github.com/IBXCODECAT/Nathan/raw/main/assets/polyrithmic/wave-key-${index}.wav`;
    console.log(file);
    const audio = new Audio(file);
  audio.volume = 0.15;
  return audio;
});
console.groupEnd();

let arcs = [];

const calculateVelocity = index => {  
    const numberOfCycles = settings.maxCycles - index,
          distancePerCycle = 2 * Math.PI;
  
  return (numberOfCycles * distancePerCycle) / settings.duration;
}

const calculateNextImpactTime = (currentImpactTime, velocity) => {
  return currentImpactTime + (Math.PI / velocity) * 1000;
}

const calculateDynamicOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
  const timeSinceImpact = currentTime - lastImpactTime,
        percentage = Math.min(timeSinceImpact / duration, 1),
        opacityDelta = maxOpacity - baseOpacity;
  
  return maxOpacity - (opacityDelta * percentage);
}

const determineOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
  if(!settings.pulseEnabled) return baseOpacity;
  
  return calculateDynamicOpacity(currentTime, lastImpactTime, baseOpacity, maxOpacity, duration);
}

const calculatePositionOnArc = (center, radius, angle) => ({
  x: center.x + radius * Math.cos(angle),
  y: center.y + radius * Math.sin(angle)
});

const playKey = index => keys[index].play();

const init = () => {
  pen.lineCap = "round";

  arcs = colors.map((color, index) => {
    const velocity = calculateVelocity(index),
          lastImpactTime = 0,
          nextImpactTime = calculateNextImpactTime(settings.startTime, velocity);

    return {
      color,
      velocity,
      lastImpactTime,
      nextImpactTime
    }
  });
}

const drawArc = (x, y, radius, start, end, action = "stroke") => {
  pen.beginPath();
  
  pen.arc(x, y, radius, start, end);
  
  if(action === "stroke") pen.stroke();    
  else pen.fill();
}

const drawPointOnArc = (center, arcRadius, pointRadius, angle) => {
  const position = calculatePositionOnArc(center, arcRadius, angle);

  drawArc(position.x, position.y, pointRadius, 0, 2 * Math.PI, "fill");    
}

const draw = () => { // Definitely not optimized
  paper.width = paper.clientWidth;
  paper.height = paper.clientHeight;

  const currentTime = new Date().getTime(),
        elapsedTime = (currentTime - settings.startTime) / 1000;
  
  const length = Math.min(paper.width, paper.height) * 0.9,
        offset = (paper.width - length) / 2;
  
  const start = {
    x: offset,
    y: paper.height / 2
  }

  const end = {
    x: paper.width - offset,
    y: paper.height / 2
  }

  const center = {
    x: paper.width / 2,
    y: paper.height / 2
  }

  const base = {
    length: end.x - start.x,
    minAngle: 0,
    startAngle: 0,
    maxAngle: 2 * Math.PI
  }

  base.initialRadius = base.length * 0.05;
  base.circleRadius = base.length * 0.006;
  base.clearance = base.length * 0.03;
  base.spacing = (base.length - base.initialRadius - base.clearance) / 2 / colors.length;

  arcs.forEach((arc, index) => {
    const radius = base.initialRadius + (base.spacing * index);

    // Draw arcs
    pen.globalAlpha = determineOpacity(currentTime, arc.lastImpactTime, 0.15, 0.65, 1000);
    pen.lineWidth = base.length * 0.002;
    pen.strokeStyle = arc.color;
    
    const offset = base.circleRadius * (5 / 3) / radius;
    
    drawArc(center.x, center.y, radius, Math.PI + offset, (2 * Math.PI) - offset);
    
    drawArc(center.x, center.y, radius, offset, Math.PI - offset);
    
    // Draw impact points
    pen.globalAlpha = determineOpacity(currentTime, arc.lastImpactTime, 0.15, 0.85, 1000);
    pen.fillStyle = arc.color;
    
    drawPointOnArc(center, radius, base.circleRadius * 0.75, Math.PI);
    
    drawPointOnArc(center, radius, base.circleRadius * 0.75, 2 * Math.PI);
    
    // Draw moving circles
    pen.globalAlpha = 1;
    pen.fillStyle = arc.color;
    
    if(currentTime >= arc.nextImpactTime) {      
      if(settings.soundEnabled) {
        playKey(index);
        arc.lastImpactTime = arc.nextImpactTime;
      }
      
      arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);      
    }
    
    const distance = elapsedTime >= 0 ? (elapsedTime * arc.velocity) : 0,
          angle = (Math.PI + distance) % base.maxAngle;
    
    drawPointOnArc(center, radius, base.circleRadius, angle);
  });
  
  requestAnimationFrame(draw);
}

init();

draw();