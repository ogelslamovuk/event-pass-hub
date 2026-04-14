// Admin Console "Obsidian Aurora" Design Tokens
export const A = {
  // Backgrounds
  pageBg: '#0A0D14',
  sidebarBg: '#101726',
  cardBg: '#162033',
  surfaceBg: '#111A2A',
  topbarBg: 'rgba(16,23,38,0.72)',
  
  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.12)',
  borderGlass: 'rgba(255,255,255,0.18)',
  
  // Text
  textPrimary: '#F5F7FA',
  textSecondary: 'rgba(245,247,250,0.70)',
  textMuted: 'rgba(245,247,250,0.45)',
  
  // Accents
  cyan: '#63E6FF',
  blue: '#3B82F6',
  violet: '#8B5CF6',
  gold: '#D4A84F',
  
  // Status
  statusOk: '#34D399',
  statusOkBg: 'rgba(52,211,153,0.15)',
  statusWarn: '#FBBF24',
  statusWarnBg: 'rgba(251,191,36,0.15)',
  statusError: '#EF4444',
  statusErrorBg: 'rgba(239,68,68,0.15)',
  statusInfo: '#3B82F6',
  statusInfoBg: 'rgba(59,130,246,0.15)',
  
  // Surfaces
  tableHeaderBg: 'rgba(255,255,255,0.04)',
  rowHover: 'rgba(99,230,255,0.06)',
  selectedBg: 'rgba(99,230,255,0.10)',
  
  // Shadows
  cardShadow: '0 8px 32px rgba(0,0,0,0.4)',
  glassShadow: '0 4px 24px rgba(0,0,0,0.3)',
  
  // Glass
  glassGradient: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)',
  cosmicGradient: 'radial-gradient(ellipse 1200px 600px at 20% 10%, rgba(99,230,255,0.07), transparent 60%), radial-gradient(ellipse 800px 400px at 80% 80%, rgba(139,92,246,0.05), transparent 60%)',
} as const;

// Status chip styles
export function statusChip(type: 'ok' | 'warn' | 'error' | 'info' | 'neutral') {
  const map = {
    ok: { bg: A.statusOkBg, color: A.statusOk },
    warn: { bg: A.statusWarnBg, color: A.statusWarn },
    error: { bg: A.statusErrorBg, color: A.statusError },
    info: { bg: A.statusInfoBg, color: A.statusInfo },
    neutral: { bg: 'rgba(255,255,255,0.08)', color: A.textSecondary },
  };
  return map[type];
}

export function appStatusChip(status: string) {
  switch (status) {
    case 'approved': return statusChip('ok');
    case 'submitted': return statusChip('info');
    case 'rejected': return statusChip('error');
    case 'draft': return statusChip('neutral');
    default: return statusChip('neutral');
  }
}

export function tktStatusChip(status: string) {
  switch (status) {
    case 'issued': return statusChip('info');
    case 'sold': return statusChip('ok');
    case 'redeemed': return statusChip('warn');
    case 'refunded': return statusChip('error');
    default: return statusChip('neutral');
  }
}

export function opResultChip(result: string) {
  return result === 'ok' ? statusChip('ok') : statusChip('error');
}
