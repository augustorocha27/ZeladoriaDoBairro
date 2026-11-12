import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

/**
 * Implements Prompt.Md Section 1 & 3:
 * - Loads Plus Jakarta Sans, Outfit, Cormorant Garamond (Italic), and JetBrains Mono on Web
 * - Injects Global SVG Noise Overlay (0.05 opacity turbulence) to eliminate flat digital gradients
 * - Defines smooth spring-bounce and keyframe animations for the Protocol Artifacts
 */
export const GlobalStylesAndNoise: React.FC = () => {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    // 1. Inject Google Fonts
    const fontLinkId = 'zeladoria-organic-tech-fonts';
    if (!document.getElementById(fontLinkId)) {
      const link = document.createElement('link');
      link.id = fontLinkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600;1,700&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(link);
    }

    // 2. Inject Custom CSS Keyframes & Spring Transitions
    const styleId = 'zeladoria-organic-tech-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        html, body, #root {
          background-color: #F2F0E9 !important;
          margin: 0;
          padding: 0;
          min-height: 100%;
        }
        @keyframes nuraSpinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes nuraSpinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes nuraLaserScan {
          0% { top: 4%; opacity: 0.9; }
          50% { top: 88%; opacity: 1; }
          100% { top: 4%; opacity: 0.9; }
        }
        @keyframes nuraPulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.92); }
        }
        @keyframes nuraEkgDash {
          0% { stroke-dashoffset: 600; }
          100% { stroke-dashoffset: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (Platform.OS !== 'web') {
    return null;
  }

  // Global SVG Noise Overlay at 0.05 opacity (Prompt.Md Section 1)
  return (
    <View style={styles.noiseOverlay} pointerEvents="none">
      {React.createElement('div', {
        style: {
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.05,
        },
        dangerouslySetInnerHTML: {
          __html: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="nura-organic-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#nura-organic-noise)" />
          </svg>`,
        },
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  noiseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
