// PageFooter — educational disclaimer + copyright shown at the bottom of every page.

import { useTheme } from '@/contexts/ThemeContext';

export default function PageFooter() {
  const { isDark } = useTheme();

  return (
    <footer
      className="px-5 py-6 text-center"
      style={{
        borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
        marginTop: '8px',
      }}
    >
      <p
        className="text-[10px] leading-relaxed max-w-sm mx-auto"
        style={{ color: isDark ? 'rgba(148,163,184,0.55)' : 'rgba(100,116,139,0.75)' }}
      >
        This app is for educational purposes only. All proprietary tools, frameworks and methodologies
        referenced are owned by their respective developers and rights holders.
      </p>
      <p
        className="text-[10px] font-semibold mt-2"
        style={{ color: isDark ? 'rgba(148,163,184,0.4)' : 'rgba(100,116,139,0.55)' }}
      >
        © Jackson Joy · February 2026
      </p>
    </footer>
  );
}
