import type { ReactNode } from 'react';
import { Building2 } from 'lucide-react';
import '../pages/auth.css';

type Props = { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode };

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <main className="auth">
      <div className="auth-card card">
        <div className="auth-brand">
          <span className="brand-mark brand-mark-lg"><Building2 size={26} /></span>
          <span>PopraviBlok</span>
        </div>
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-sub">{subtitle}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </main>
  );
}