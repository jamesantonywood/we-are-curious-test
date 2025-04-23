import gsap from "gsap";
import Splitting from "splitting";

// Main animation controller class
export default class WordAnimation {
  constructor(options = {}) {
    // Default options
    this.options = {
      wordContainerSelector: 'h1',
      projectContainerSelector: '.project-container',
      wordDuration: 3,
      animationDuration: 1,
      projectDelay: 3,
      ...options
    };

    // Initialize words array
    this.words = [
      {
        title: 'curious',
        projects: []
      },
      {
        title: 'animators',
        projects: [{id: 1, url:"https://picsum.photos/300/200"}, {id: 2, url:"https://picsum.photos/400"}, {id: 3, url:"https://picsum.photos/500/300"}]
      },
      {
        title: 'strategists',
        projects: [{id: 1, url:"https://picsum.photos/400"}, {id: 2, url:"https://picsum.photos/200/300"}, {id: 3, url:"https://picsum.photos/400/200"}]
      },
      {
        title: 'designers',
        projects: [{id: 1, url:"https://picsum.photos/500"}, {id: 2, url:"https://picsum.photos/300/200"}, {id: 3, url:"https://picsum.photos/400"}]
      },
      {
        title: 'developers',
        projects: [{id: 1, url:"https://picsum.photos/400"}, {id: 2, url:"https://picsum.photos/200/300"}, {id: 3, url:"https://picsum.photos/400/200"}]
      },
      {
        title: 'creators',
        projects: [{id: 1, url:"https://picsum.photos/300/200"}, {id: 2, url:"https://picsum.photos/400"}, {id: 3, url:"https://picsum.photos/500/300"}]
      }
    ];

    // Set initial state
    this.current = 0;
    this.activeImages = [];
    
    // Initialize Splitting
    Splitting();
  }

  // Initialize the animation
  init() {
    // Get DOM references
    this.h1 = document.querySelector(this.options.wordContainerSelector);
    this.projectContainer = document.querySelector(this.options.projectContainerSelector);
    
    // Create word container if it doesn't exist
    this.wordContainer = this.h1.querySelector('.word-container');
    if (!this.wordContainer) {
      this.wordContainer = document.createElement('span');
      this.wordContainer.classList.add('word-container');
      this.h1.appendChild(this.wordContainer);
    }
    
    // Start the animation
    this.setWord();
  }

  // Get the center of the screen
  getScreenCenter() {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  }

  // Move to the next word
  nextWord() {
    this.current++;
    
    if (this.current > this.words.length - 1) {
      this.current = 0;
    }
    
    this.setWord();
  }

  // Set and animate a word
  setWord() {
    const word = this.words[this.current];
    
    // Clear the word container
    this.wordContainer.innerHTML = '';
    
    // Create a new span for the word
    const span = document.createElement('span');
    span.classList.add('word');
    span.innerHTML = word.title;
    this.wordContainer.appendChild(span);
    
    // Use Splitting to split the word into chars
    const splitResult = Splitting({
      target: span,
      by: 'chars'
    });
    
    // Animate the characters in
    const tl = gsap.timeline({ loop: true });
    
    tl.set('.word .char', {
      y: '-100%',
      opacity: 0,
      rotate: "25deg",
    }).to('.word .char', {
      y: 0,
      opacity: 1,
      rotate: '0deg',
      ease: "elastic.out(1,0.7)",
      stagger: 0.1,
      duration: this.options.animationDuration,
      onStart: () => {
        this.showProjects();
      },
    });
    
    // Animate the characters out after a delay
    tl.to('.word .char', {
      y: '100%',
      opacity: 0,
      rotate: "50deg",
      ease: "elastic.in(1,0.7)",
      stagger: 0.1,
      duration: this.options.animationDuration,
      delay: this.options.wordDuration,
     
      onComplete: () => {
        this.nextWord();
      }
    });
  }

  // Generate predefined positions in a grid layout
  generatePositionGrid(imgWidth, imgHeight) {
    const positions = [];
    const center = this.getScreenCenter();
    
    // Calculate the safe area with 10% padding
    const paddingX = window.innerWidth * 0.1;
    const paddingY = window.innerHeight * 0.1;
    
    // Available space
    const availableWidth = window.innerWidth - (paddingX * 2);
    const availableHeight = window.innerHeight - (paddingY * 2);
    
    // Create a grid with enough cells for all possible images
    // Use the largest image dimension plus buffer to determine cell size
    const bufferSize = 50;
    const cellSize = Math.max(imgWidth, imgHeight) + bufferSize;
    
    // Generate positions in specific regions around the center
    // Top-left quadrant
    positions.push({
      x: center.x - (availableWidth * 0.25),
      y: center.y - (availableHeight * 0.25)
    });
    
    // Top-right quadrant
    positions.push({
      x: center.x + (availableWidth * 0.25),
      y: center.y - (availableHeight * 0.25)
    });
    
    // Bottom-left quadrant
    positions.push({
      x: center.x - (availableWidth * 0.25),
      y: center.y + (availableHeight * 0.25)
    });
    
    // Bottom-right quadrant
    positions.push({
      x: center.x + (availableWidth * 0.25),
      y: center.y + (availableHeight * 0.25)
    });
    
    // Add some additional positions if needed
    positions.push({
      x: center.x,
      y: center.y - (availableHeight * 0.35)
    });
    
    positions.push({
      x: center.x,
      y: center.y + (availableHeight * 0.35)
    });
    
    positions.push({
      x: center.x - (availableWidth * 0.35),
      y: center.y
    });
    
    positions.push({
      x: center.x + (availableWidth * 0.35),
      y: center.y
    });
    
    // Add some randomness to the positions
    return positions.map(pos => ({
      x: pos.x + (Math.random() * 20 - 10),
      y: pos.y + (Math.random() * 20 - 10)
    }));
  }

  // Check if a rectangle overlaps with any of the active images
  isOverlapping(x, y, width, height) {
    // Create rectangle with a buffer for visual separation
    const buffer = 30;
    const rect1 = {
      left: x - (width/2) - buffer,
      right: x + (width/2) + buffer,
      top: y - (height/2) - buffer,
      bottom: y + (height/2) + buffer
    };
    
    // Check against all active images
    for (const img of this.activeImages) {
      const rect2 = {
        left: img.x - (img.width/2),
        right: img.x + (img.width/2),
        top: img.y - (img.height/2),
        bottom: img.y + (img.height/2)
      };
      
      // Check if the rectangles overlap
      if (!(rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom)) {
        return true; // Overlap detected
      }
    }
    
    return false; // No overlap
  }

  // Preload an image and return its dimensions as a promise
  preloadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({
        url,
        width: img.width,
        height: img.height
      });
      img.src = url;
    });
  }

  // Show and animate project images
  showProjects() {
    const projects = this.words[this.current].projects;
    const center = this.getScreenCenter();
    
    // Clear the active images array before showing new projects
    this.activeImages = [];

    // Wait a bit to ensure all previous images are cleaned up
    setTimeout(() => {
      // First, create and load all images to get their dimensions
      const imagePromises = projects.map(project => this.preloadImage(project.url));
      
      // Once all images are loaded, we know their dimensions
      Promise.all(imagePromises).then(loadedImages => {
        // Find the largest image dimensions
        const maxWidth = Math.max(...loadedImages.map(img => img.width));
        const maxHeight = Math.max(...loadedImages.map(img => img.height));
        
        // Generate a grid of non-overlapping positions
        const positionGrid = this.generatePositionGrid(maxWidth, maxHeight);
        
        // Now create and animate each image
        loadedImages.forEach((imgData, index) => {
          this.animateProjectImage(imgData, center, positionGrid[index % positionGrid.length], index);
        });
      });
    }, 200); // Wait 200ms to ensure cleanup
  }

  // Create and animate a single project image
  animateProjectImage(imgData, center, position, index) {
    const p = document.createElement('img');
    p.setAttribute('src', imgData.url);
    p.style.left = `${center.x}px`;
    p.style.top = `${center.y}px`;
    p.style.transform = 'translate(-50%, -50%)';
    
    this.projectContainer.appendChild(p);
    
    // Add this image to the active images list
    const activeImage = {
      x: position.x,
      y: position.y,
      width: imgData.width,
      height: imgData.height,
      element: p
    };
    
    this.activeImages.push(activeImage);
    
    // Animate the image outward
    gsap.to(p, {
        left: position.x,
        top: position.y,
        opacity: 1,
        scale: 1,
        duration: this.options.animationDuration * 1.5,
        ease: "elastic.out(1, 1.5)",
        delay: index * 0.2,
        onComplete: () => {
          // Add a delay before fading out
          setTimeout(() => {
            this.fadeOutImage(activeImage);
          }, this.options.projectDelay * 1000);
        }
      })
    
}

  // Fade out and remove an image
  fadeOutImage(activeImage) {
    gsap.to(activeImage.element, {
      opacity: 0,
      duration: 0.25,
      delay: 0,
      onComplete: () => {
        // Remove from active images list
        const imgIndex = this.activeImages.findIndex(img => img.element === activeImage.element);
        if (imgIndex !== -1) {
          this.activeImages.splice(imgIndex, 1);
        }
        
        // Remove from DOM
        if (activeImage.element.parentNode) {
          activeImage.element.parentNode.removeChild(activeImage.element);
        }
      }
    });
  }
}