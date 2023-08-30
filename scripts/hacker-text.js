const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

document.querySelector("h1").onmouseenter = event => {
    
    let iterations = 0;

    const interval = setInterval(() => {
        event.target.innerText = event.target.innerText.split("")
        .map((letter, index) => {
            if(index < iterations) {
                return event.target.dataset.content[index];
            }

            return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

        if(iterations >= event.target.dataset.content.length) clearInterval(interval);
        iterations += 1 / 3;

    }, 30);
    
}   