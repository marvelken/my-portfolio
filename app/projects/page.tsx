"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Eye, Sun, Moon } from "lucide-react";

export default function ProjectsPage() {
  const [isDark, setIsDark] = useState(true);
  const [views, setViews] = useState<Record<string, number>>({});

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Load views data
  useEffect(() => {
    const loadViews = async () => {
      try {
        const response = await fetch('/api/views');
        if (response.ok) {
          const viewsData = await response.json();
          setViews(viewsData);
        } else {
          console.error("Failed to load views:", response.statusText);
          // Fallback to zero views
          const fallbackViews = allProjects.reduce((acc, project) => {
            acc[project.slug] = 0;
            return acc;
          }, {} as Record<string, number>);
          setViews(fallbackViews);
        }
      } catch (error) {
        console.error("Failed to load views:", error);
        // Fallback to zero views
        const fallbackViews = allProjects.reduce((acc, project) => {
          acc[project.slug] = 0;
          return acc;
        }, {} as Record<string, number>);
        setViews(fallbackViews);
      }
    };

    loadViews();
  }, []);

  // Get published projects and sort them by date
  const publishedProjects = allProjects
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  // Use the first three projects as featured
  const featured = publishedProjects[0];
  const top2 = publishedProjects[1];
  const top3 = publishedProjects[2];

  // The rest follow the normal grid layout
  const sorted = publishedProjects.slice(3);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Theme classes
  const bgClass = isDark ? 'bg-black' : 'bg-white';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-zinc-500' : 'text-gray-500';
  const borderClass = isDark ? 'bg-zinc-800' : 'bg-gray-200';
  const cardBorder = isDark ? 'border-gray-900/10' : 'border-gray-200';

  // If we don't have enough projects, show an error message
  if (!featured) {
    return (
      <div className={`relative pb-16 min-h-screen transition-colors duration-300 ${bgClass}`}>
        <Navigation />
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${
            isDark 
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 shadow-lg' 
              : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <h2 className={`text-3xl font-bold tracking-tight ${textPrimary} sm:text-4xl`}>
              Projects
            </h2>
            <p className={`mt-4 ${textSecondary}`}>
              No published projects found. Please add some projects to your content folder and set published: true.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative pb-16 min-h-screen transition-colors duration-300 ${bgClass}`}>
      <Navigation />
      
      {/* Beautiful Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isDark 
            ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 shadow-lg hover:shadow-xl' 
            : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg hover:shadow-xl border border-gray-200'
        }`}
        aria-label="Toggle theme"
      >
        <div className="relative">
          <Sun className={`w-5 h-5 transition-all duration-300 ${isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
          <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
        </div>
      </button>

      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className={`text-3xl font-bold tracking-tight ${textPrimary} sm:text-4xl transition-colors duration-300`}>
            Projects
          </h2>
          <p className={`mt-4 ${textSecondary} transition-colors duration-300`}>
            Welcome to my Technical Writing Hub. These projects showcase my
            journey from beginner to professional, though they represent just a
            fraction of my work. Download my resume for a complete overview of
            my articles and experience.
          </p>
        </div>
        <div className={`w-full h-px ${borderClass} transition-colors duration-300`} />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card>
            <Link href={`/projects/${featured.slug}`}>
              <article className="relative w-full h-full p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <div className={`text-xs ${textPrimary} transition-colors duration-300`}>
                    {featured.date ? (
                      <time dateTime={new Date(featured.date).toISOString()}>
                        {Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                        }).format(new Date(featured.date))}
                      </time>
                    ) : (
                      <span>SOON</span>
                    )}
                  </div>
                  <span className={`flex items-center gap-1 text-xs ${textMuted} transition-colors duration-300`}>
                    <Eye className="w-4 h-4" />{" "}
                    {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                      views[featured.slug] ?? 0
                    )}
                  </span>
                </div>

                <h2
                  id="featured-post"
                  className={`mt-4 text-3xl font-bold ${textPrimary} group-hover:${isDark ? 'text-white' : 'text-black'} sm:text-4xl font-display transition-colors duration-300`}
                >
                  {featured.title}
                </h2>
                <p className={`mt-4 leading-8 duration-150 ${textSecondary} group-hover:${isDark ? 'text-zinc-300' : 'text-gray-700'} transition-colors`}>
                  {featured.description}
                </p>
                <div className="absolute bottom-4 md:bottom-8">
                  <p className={`hidden ${isDark ? 'text-zinc-200 hover:text-zinc-50' : 'text-gray-700 hover:text-gray-900'} lg:block transition-colors duration-300`}>
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>

          <div className={`flex flex-col w-full gap-8 mx-auto border-t ${cardBorder} lg:mx-0 lg:border-t-0 transition-colors duration-300`}>
            {[top2, top3].filter(Boolean).map((project) => (
              <Card key={project.slug}>
                <Article project={project} views={views[project.slug] ?? 0} />
              </Card>
            ))}
          </div>
        </div>
        <div className={`hidden w-full h-px md:block ${borderClass} transition-colors duration-300`} />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}