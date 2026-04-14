import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        surface: 'var(--color-surface)',
        elevated: 'var(--color-elevated)',
        primary: 'var(--color-primary)',
        'primary-strong': 'var(--color-primary-strong)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
        accent: 'var(--color-accent)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        'text-on-primary': 'var(--color-text-on-primary)',
        default: 'var(--color-border-default)',
      },
    },
  },
};

export default config;
