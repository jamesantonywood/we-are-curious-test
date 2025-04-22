import gsap from "gsap"
import Splitting from "splitting"

// Define our words array with "curious" as the first word
const words = [
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

// Initialize Splitting
Splitting();

// Set up variables for our animation
let current = 0;
let h1, wordContainer, projectContainer;

// Initialize the DOM references
const init = () => {
  h1 = document.querySelector('h1');
  wordContainer = h1.querySelector('.word-container');
  projectContainer = document.querySelector('.project-container');

  if (!wordContainer) {
    wordContainer = document.createElement('span');
    wordContainer.classList.add('word-container');
    h1.appendChild(wordContainer);
  }
};

// Set and animate a word
const setWord = () => {
  // Get the current word from our array
  const word = words[current];

  // Clear the word container
  wordContainer.innerHTML = '';

  // Create a new span for the word
  const span = document.createElement('span');
  span.classList.add('word');
  span.innerHTML = word.title;
  wordContainer.appendChild(span);

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
    duration: 0.8,
  });

  // Animate the characters out after a delay
  tl.to('.word .char', {
    y: '100%',
    opacity: 0,
    rotate: "50deg",
    ease: "elastic.in(1,0.7)",
    stagger: 0.1,
    duration: 0.75,
    delay: 3, // Show the word for 2 seconds
    onComplete: () => {
      nextWord()
      showProjects()
    }
  });
};

const showProjects = () => {

  const projects = words[current].projects
  const center = getScreenCenter();

  projects.forEach((project, index) => {

    const p = document.createElement('img')
    p.setAttribute('src', project.url)
    p.style.left = `${center.x}px`;
    p.style.top = `${center.y}px`;
   
    projectContainer.appendChild(p);
    const destination = getRandomPosition();
    // Animate the square
    gsap.to(p, {
      left: destination.x,
      top: destination.y,
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "elastic.out(1, 1.5)",
      delay: index * 0.2,
      onComplete: () => {
        // Fade out and remove after a delay
        gsap.to(p, {
          opacity: 0,
          scale: 0.5,
          duration: 0.5,
          delay: 4,
          onComplete: () => {
            if (p.parentNode) {
              p.parentNode.removeChild(p);
            }
          }
        });
      }
    });
  })

}

// Generate a random position on screen
const getRandomPosition = () => {
  const x = Math.floor(Math.random() * window.innerWidth) ;
  const y = Math.floor(Math.random() * window.innerHeight);
  return { x, y };
};

// Get the center of the screen
const getScreenCenter = () => {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
};

// Function to move to the next word
const nextWord = () => {
  // Update the current index
  current++;

  // If we've gone through "curious" and 3 more words, go back to "curious"
  if (current > words.length - 1) {
    current = 0;
  }

  // Set and animate the new word
  setWord();
};

// Initialize and start the animation
document.addEventListener('DOMContentLoaded', () => {
  init();
  setWord();
});