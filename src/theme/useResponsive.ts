import { useWindowDimensions } from 'react-native';

export interface ResponsiveMetrics {
  width: number;
  height: number;
  isSmallPhone: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  pagePadding: number;
}

/**
 * Reactive viewport hook for universal responsiveness across:
 * - Small Phones (< 390px)
 * - Standard Phones (< 768px)
 * - Tablets (768px - 1023px)
 * - Desktops / Widescreens (>= 1024px)
 */
export const useResponsive = (): ResponsiveMetrics => {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 390;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const pagePadding = isSmallPhone ? 12 : isMobile ? 16 : 24;

  return {
    width,
    height,
    isSmallPhone,
    isMobile,
    isTablet,
    isDesktop,
    pagePadding,
  };
};
