"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Moon, Sun, Info } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

export function ImageLoaderWithConfetti() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setTimeElapsed(Date.now() - startTime);
    }, 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [imageLoaded]);

  const handleImageLoad = async () => {
    await new Promise((res) => setTimeout(() => res(true), 2000));
    setImageLoaded(true);
  };

  const reloadImage = () => {
    setImageLoaded(false);
    setTimeElapsed(0);
    handleImageLoad();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="relative w-[400px] h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-4">
        {!imageLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-spin" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {timeElapsed.toLocaleString()} ms
              </span>
            </div>
          </div>
        )}
        <img
          src="/placeholder.svg?height=400&width=400"
          alt="Loaded image"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex space-x-4 mt-4">
        <Button onClick={reloadImage} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Reload Image</span>
        </Button>
        <Button onClick={toggleDarkMode} variant="outline" size="icon">
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Dark Mode</span>
        </Button>
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          size="icon"
        >
          <Info className="h-4 w-4" />
          <span className="sr-only">Toggle Image Details</span>
        </Button>
      </div>
      {showDetails && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">
            Image Details
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Size: 400x400 pixels
          </p>
          <p className="text-gray-600 dark:text-gray-300">Type: SVG</p>
          <p className="text-gray-600 dark:text-gray-300">
            Load Time: {timeElapsed.toLocaleString()} ms
          </p>
        </div>
      )}
    </div>
  );
}
