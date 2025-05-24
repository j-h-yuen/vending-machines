document.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.getElementById("enter-map");
  if (enterButton) {
    enterButton.addEventListener("click", () => {
      document.getElementById("intro-overlay").style.display = "none";
    });
  }
});

// document represents web page - attaches event lister - "DOMContentLoaded" event name () => { ... } - arrow function, when this event happens, run this code
// variable is equal to ElementID named "enter-map" (button)
// if button clicked , finds "intro-overlay" and changes inline style to "none" hiding it 