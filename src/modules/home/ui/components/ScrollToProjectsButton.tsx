"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export const ScrollToProjectsButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById('projects-list');
      
      if (!projectsSection) {
        return;
      }

      const rect = projectsSection.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      
      console.log('Scroll position:', scrollY);
      console.log('Projects section top:', rect.top);
      console.log('Window height:', window.innerHeight);
      
      // Hide when we've scrolled past 200px
      if (scrollY > 200) {
        console.log('Hiding button');
        setIsVisible(false);
      } else {
        console.log('Showing button');
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects-list');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  console.log('Button visible state:', isVisible);

  return (
    <button
      onClick={scrollToProjects}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'all 0.3s ease'
      }}
      className="hidden md:flex fixed right-8 bottom-8 w-12 h-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-50"
      aria-label="Scroll to projects"
    >
      <ChevronDown className="w-6 h-6 animate-bounce" />
    </button>
  );
};