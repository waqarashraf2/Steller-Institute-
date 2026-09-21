import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultWebsiteImages } from '../data/defaultImages';

const WebsiteImagesContext = createContext({});

const CACHE_KEY = 'stellar_website_images';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, images } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return images;
  } catch {
    return null;
  }
}

function saveCache(images) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), images }));
  } catch {}
}

export function WebsiteImagesProvider({ children }) {
  const cached = loadCache();
  const [images, setImages] = useState(() => ({
    ...defaultWebsiteImages,
    ...(cached || {})
  }));
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || '/api';
    fetch(`${API}/admin-images`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const imgMap = {};
          data.forEach(img => {
            imgMap[img.placeholder_key] = img.image_url;
          });
          setImages(imgMap);
          saveCache(imgMap);

          // Preload the first hero slide image so the browser starts
          // downloading it immediately before React renders the <img>.
          const heroKey = Object.keys(imgMap).find(k => k.toLowerCase().includes('hero') && k.includes('1'));
          const firstUrl = heroKey ? imgMap[heroKey] : Object.values(imgMap)[0];
          if (firstUrl) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = firstUrl;
            link.fetchPriority = 'high';
            document.head.appendChild(link);
          }
        }
      })
      .catch(err => console.error('Failed to load website images:', err));
  }, []);

  return (
    <WebsiteImagesContext.Provider value={{ images, loaded }}>
      {children}
    </WebsiteImagesContext.Provider>
  );
}

export function useWebsiteImage(placeholderKey) {
  const context = useContext(WebsiteImagesContext);
  if (!context || !context.images) return null;
  return context.images[placeholderKey] || null;
}

export function useWebsiteImages() {
  return useContext(WebsiteImagesContext);
}
