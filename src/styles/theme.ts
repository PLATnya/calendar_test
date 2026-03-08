export const theme = {
  colors: {
    // Primary palette - minimalistic neutral tones
    background: '#fafafa',
    surface: '#ffffff',
    surfaceHover: '#f5f5f5',
    
    // Text colors
    text: {
      primary: '#18181b',
      secondary: '#52525b',
      muted: '#71717a',
      inverse: '#ffffff',
    },
    
    // Border colors
    border: {
      default: '#e4e4e7',
      hover: '#d4d4d8',
      focus: '#a1a1aa',
      active: '#71717a',
    },
    
    // Accent colors - refined sky blue
    accent: {
      primary: '#0ea5e9',
      light: '#e0f2fe',
      hover: '#0284c7',
    },
    
    // Semantic colors
    today: {
      background: '#ffedd5',
      border: '#fb923c',
      text: '#9a3412',
    },
    
    holiday: {
      background: '#fce7f3',
      border: '#f472b6',
      text: '#9d174d',
    },
    
    // State colors
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.35)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
  
  layout: {
    container: {
      maxWidth: '1400px',
      padding: '24px',
    },
    calendar: {
      gap: '4px',
      cellPadding: '8px',
    },
  },
} as const;

export type Theme = typeof theme;
