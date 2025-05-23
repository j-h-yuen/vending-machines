document.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.getElementById("enter-map");
  if (enterButton) {
    enterButton.addEventListener("click", () => {
      document.getElementById("intro-overlay").style.display = "none";
    });
  }
});