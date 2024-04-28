// animation.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const runAnimation = () => {
  gsap.set('.nav_bar', { opacity: 0 });
  gsap.to('.nav_bar', { y: 0, ease: 'none', opacity: 1, duration: 3 });
};
