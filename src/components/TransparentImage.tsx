import React, { useState, useEffect } from "react";

interface TransparentImageProps {
  src: string;
  alt: string;
  className?: string;
  threshold?: number;
  fadeRange?: number;
  cropBottomPercent?: number; // percentage of bottom to make transparent to remove text (e.g. 18%)
}

export const TransparentImage: React.FC<TransparentImageProps> = ({
  src,
  alt,
  className = "",
  threshold = 38,
  fadeRange = 22,
  cropBottomPercent = 18,
}) => {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    
    img.onload = () => {
      if (!active) return;
      
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        setProcessedSrc(src);
        return;
      }
      
      // Draw original image fully to canvas
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Let's dynamically map background colors by sampling the top, left, and right margins
        // which contain the background gradient (avoiding the bottom where the subject is).
        const bgColors: { r: number; g: number; b: number }[] = [];
        const addBgColor = (r: number, g: number, b: number) => {
          const exists = bgColors.some(
            (c) => Math.abs(c.r - r) < 12 && Math.abs(c.g - g) < 12 && Math.abs(c.b - b) < 12
          );
          if (!exists) {
            bgColors.push({ r, g, b });
          }
        };

        // Sample along the top edge
        for (let x = 0; x < canvas.width; x += Math.max(1, Math.floor(canvas.width / 20))) {
          for (let y = 0; y < Math.min(20, canvas.height); y += 5) {
            const idx = (y * canvas.width + x) * 4;
            if (idx < data.length) {
              addBgColor(data[idx], data[idx + 1], data[idx + 2]);
            }
          }
        }

        // Sample along left and right side margins (upper 65% only to skip subjects/robes)
        const sampleHeightY = Math.floor(canvas.height * 0.65);
        for (let y = 0; y < sampleHeightY; y += Math.max(1, Math.floor(sampleHeightY / 15))) {
          // Left margin
          for (let x = 0; x < Math.min(20, canvas.width); x += 5) {
            const idx = (y * canvas.width + x) * 4;
            if (idx < data.length) {
              addBgColor(data[idx], data[idx + 1], data[idx + 2]);
            }
          }
          // Right margin
          for (let x = Math.max(0, canvas.width - 20); x < canvas.width; x += 5) {
            const idx = (y * canvas.width + x) * 4;
            if (idx < data.length) {
              addBgColor(data[idx], data[idx + 1], data[idx + 2]);
            }
          }
        }

        // Add typical sepia/yellow/beige/white template colors for fallback/safety
        addBgColor(255, 255, 255); // Pure white
        addBgColor(245, 245, 245); // Off-white
        addBgColor(242, 232, 206); // Warm sepia / yellowish-beige
        addBgColor(246, 236, 214); // Light yellow-beige
        addBgColor(234, 219, 188); // Sepia gold
        addBgColor(220, 205, 175); // Darker sepia
        addBgColor(240, 230, 210); // Beige

        // Loop through and make background pixels transparent with smooth alpha feathering
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Determine current position
          const currentPixelIndex = i / 4;
          const pixelY = Math.floor(currentPixelIndex / canvas.width);

          // Clear the bottom portion of the image to remove text cleanly but keep empty transparent padding
          // so the PNG retains its original 100% height and aspect ratio!
          const cutoffY = Math.floor(canvas.height * (1 - cropBottomPercent / 100));
          if (pixelY >= cutoffY) {
            data[i + 3] = 0; // completely transparent
            continue;
          }

          // Compute minimum distance to any sampled background color
          let minTargetDist = 99999;
          for (const bg of bgColors) {
            const dist = Math.sqrt(
              Math.pow(r - bg.r, 2) + Math.pow(g - bg.g, 2) + Math.pow(b - bg.b, 2)
            );
            if (dist < minTargetDist) {
              minTargetDist = dist;
            }
          }

          // Warm-sepia/beige heuristic fallback:
          // If the color matches the sepia tone profile (bright yellow-sepia / warm-beige),
          // classify it as background by lowering the target distance.
          const isSepiaBeige = r > 165 && g > 155 && b > 105 && r > b + 15 && g > b + 10;
          if (isSepiaBeige) {
            minTargetDist = Math.min(minTargetDist, 12);
          }

          // If we are in the bottom 30% of the non-cropped image, clear any black/gray background under or around the red robe
          if (pixelY > canvas.height * 0.7) {
            const isRedRobe = r > 45 && r > g * 1.12 && r > b * 1.12;
            if (!isRedRobe) {
              data[i + 3] = 0; // Make non-robe background and dark strips completely transparent
              continue; // Skip further processing for this pixel
            }
          }

          // Softly feather the absolute bottom of the crimson robe (pre-cutoff)
          const bottomFadeStart = cutoffY - 18;
          if (pixelY >= bottomFadeStart) {
            const ratio = (cutoffY - pixelY) / 18;
            data[i + 3] = Math.max(0, Math.round(data[i + 3] * ratio));
          }

          // Apply transparent alpha masking
          if (minTargetDist < threshold) {
            data[i + 3] = 0; // Completely transparent
          } else if (minTargetDist < threshold + fadeRange) {
            // Smooth feathering
            const ratio = (minTargetDist - threshold) / fadeRange;
            data[i + 3] = Math.round(a * ratio);
          }
        }
        
        // Write the processed transparent image back to the main canvas
        ctx.putImageData(imageData, 0, 0);

        // Find bounding box of remaining visible pixels (alpha > 15) to perform an auto-crop.
        // This eliminates all the unused transparent/empty margins so that Dante can scale perfectly!
        let minX = canvas.width;
        let maxX = 0;
        let minY = canvas.height;
        let maxY = 0;
        let hasVisiblePixels = false;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const a = data[idx + 3];
            if (a > 15) { // Any pixel with a non-negligible opacity
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              hasVisiblePixels = true;
            }
          }
        }

        if (hasVisiblePixels) {
          // Add a small safe padding to prevent tight visual clipping details (like laurel wreath edges or robe sides)
          const padding = 12;
          minX = Math.max(0, minX - padding);
          minY = Math.max(0, minY - padding);
          maxX = Math.min(canvas.width - 1, maxX + padding);
          maxY = Math.min(canvas.height - 1, maxY + padding);

          const cropWidth = maxX - minX + 1;
          const cropHeight = maxY - minY + 1;

          if (cropWidth > 20 && cropHeight > 20) {
            const croppedCanvas = document.createElement("canvas");
            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;
            const croppedCtx = croppedCanvas.getContext("2d");
            
            if (croppedCtx) {
              // Copy only the bounding box region containing the active subject
              croppedCtx.drawImage(
                canvas, 
                minX, minY, cropWidth, cropHeight, 
                0, 0, cropWidth, cropHeight
              );
              setProcessedSrc(croppedCanvas.toDataURL("image/png"));
              return;
            }
          }
        }

        // Fallback to full processed transparent image if no content was found or crop failed
        setProcessedSrc(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("Error setting transparent background:", err);
        setProcessedSrc(src);
      }
    };
    
    img.onerror = () => {
      if (!active) return;
      setProcessedSrc(src);
    };

    return () => {
      active = false;
    };
  }, [src, threshold, fadeRange, cropBottomPercent]);

  // Loading skeleton placeholder with original dimensions
  if (!processedSrc) {
    return (
      <div 
        className={`bg-stone-100 dark:bg-stone-800 animate-pulse flex items-center justify-center ${className}`}
        style={{ minHeight: "16rem" }}
      >
        <div className="w-8 h-8 rounded-full border-4 border-[#a4161a] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <img
      src={processedSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
};
