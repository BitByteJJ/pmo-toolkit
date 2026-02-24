// PageFooter — educational disclaimer + copyright shown at the bottom of every page.

import { useTheme } from '@/contexts/ThemeContext';

export default function PageFooter() {
  const { isDark } = useTheme();

  const disclaimerColor = isDark ? 'rgba(148,163,184,0.75)' : 'rgba(71,85,105,0.85)';
  const nameColor = isDark ? '#94a3b8' : '#475569';

  return (
    <footer
      className="px-5 pt-6 pb-24 text-center"
      style={{
        borderTop: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.12)',
        marginTop: '8px',
      }}
    >
      <p
        className="text-[11px] leading-relaxed max-w-sm mx-auto"
        style={{ color: disclaimerColor }}
      >
        This app is for educational purposes only. All proprietary tools, frameworks and
        methodologies referenced are owned by their respective developers and rights holders.
      </p>
      <p
        className="text-[11px] font-bold mt-3"
        style={{ color: nameColor }}
      >
        © Jackson Joy · February 2026
      </p>
    </footer>
  );
}
