import ColorThief from '../../node_modules/colorthief/dist/color-thief.mjs'

import WordAnimation from "./classes/WordAnimation";

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const animation = new WordAnimation({
    wordDuration: 5,
    animationDuration: 0.75,
    projectDelay: 5
  });
  
  animation.init();


  const projects = document.querySelectorAll('.project');
  projects.forEach((project, index) => {
    const colorThief = new ColorThief();
    const img = project.querySelector('img');

    // Make sure image is finished loading
    if (img.complete) {
      colorThief.getColor(img);
    } else {
      img.addEventListener('load', function() {
        colorThief.getColor(img);
      });
    }
    console.log(colorThief);
  })
})