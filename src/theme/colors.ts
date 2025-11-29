export const lightTheme = {
  // Primary purple shades - 前沿科技紫色
  primary: '#7C3AED', // Vibrant purple
  primaryLight: '#A78BFA', // Light purple
  primaryDark: '#5B21B6', // Deep purple
  primaryGlow: 'rgba(124, 58, 237, 0.15)', // Purple glow

  // Accent purples
  accent: '#8B5CF6', // Medium purple
  accentLight: '#C4B5FD', // Very light purple
  accentDark: '#6D28D9', // Dark accent purple

  // Background colors
  background: '#FAFAFA', // Light gray background
  backgroundElevated: '#FFFFFF', // White for cards
  backgroundHover: '#F5F3FF', // Light purple tint on hover

  // Text colors
  text: '#1F2937', // Dark gray
  textSecondary: '#6B7280', // Medium gray
  textMuted: '#9CA3AF', // Light gray
  textInverse: '#FFFFFF', // White text

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderAccent: '#DDD6FE', // Light purple border

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Chart colors - purple variants
  chart1: '#7C3AED',
  chart2: '#A78BFA',
  chart3: '#8B5CF6',
  chart4: '#C4B5FD',
  chart5: '#6D28D9',

  // Shadows
  shadow: 'rgba(124, 58, 237, 0.1)',
  shadowStrong: 'rgba(124, 58, 237, 0.2)',
};

export const darkTheme = {
  // Primary purple shades - 深色科技紫
  primary: '#A78BFA', // Lighter purple for dark mode
  primaryLight: '#C4B5FD', // Very light purple
  primaryDark: '#7C3AED', // Vibrant purple
  primaryGlow: 'rgba(167, 139, 250, 0.2)', // Purple glow

  // Accent purples
  accent: '#8B5CF6', // Medium purple
  accentLight: '#DDD6FE', // Light purple
  accentDark: '#6D28D9', // Dark purple

  // Background colors - 深紫色背景系统
  background: '#1A0B2E', // Very dark purple
  backgroundElevated: '#2D1B4E', // Dark purple for cards
  backgroundHover: '#3E2A5C', // Medium dark purple on hover

  // Text colors - 高对比度
  text: '#F3F4F6', // Light gray/white
  textSecondary: '#D1D5DB', // Medium light gray
  textMuted: '#9CA3AF', // Medium gray
  textInverse: '#1F2937', // Dark for light backgrounds

  // Border colors
  border: '#4C3A6B', // Purple-tinted border
  borderLight: '#3E2A5C', // Darker purple border
  borderAccent: '#7C3AED', // Vibrant purple border

  // Status colors - adjusted for dark mode
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Chart colors - brighter purples for dark mode
  chart1: '#A78BFA',
  chart2: '#C4B5FD',
  chart3: '#8B5CF6',
  chart4: '#DDD6FE',
  chart5: '#7C3AED',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowStrong: 'rgba(0, 0, 0, 0.5)',
};

export type Theme = typeof lightTheme;
