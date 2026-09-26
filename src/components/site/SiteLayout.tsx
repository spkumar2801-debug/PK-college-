import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

const links = [
  ["About", "/about"], ["Academics", "/academics"], ["Achievements", "/achievements"],
  ["Placements", "/placements"], ["Gallery", "/gallery"], ["Events", "/events"], ["News", "/announcements"],
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { setOpen(false); }, [pathname]);
  return <div className="min-h-screen bg-background text-foreground font-sans">
    <div className="topline"><div className="site-container flex items-center justify-between gap-4"><span>Vijayawada, Andhra Pradesh</span><a href={`mailto:${site.email}`} className="hidden sm:block hover:underline">{site.email}</a><span className="sm:hidden">Engineering education</span></div></div>
    <header className="site-header">
      <div className="site-container header-inner">
        <Link to="/" aria-label="PK Technology of Engineering home" className="brand"><span className="brand-mark">PK<span className="brand-mark-dot">.</span></span><span className="brand-copy"><strong>PK TECHNOLOGY</strong><small>OF ENGINEERING</small></span></Link>
        <nav aria-label="Main navigation" className="desktop-nav">{links.map(([label, href]) => <Link key={href} to={href} className="nav-link" activeProps={{ className: "nav-link active" }}>{label}</Link>)}</nav>
        <div className="header-actions"><Button asChild variant="header" size="sm"><Link to="/contact">Enquire now <ArrowUpRight /></Link></Button><Button variant="iconPlain" size="icon" className="mobile-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
      </div>
      {open && <nav aria-label="Mobile navigation" className="mobile-nav">{links.map(([label, href]) => <Link key={href} to={href}>{label}<ArrowUpRight size={16} /></Link>)}<Link to="/contact">Contact <ArrowUpRight size={16} /></Link></nav>}
    </header>
    <main key={pathname} className="page-enter">{children}</main>
    <footer className="footer"><div className="site-container"><div className="footer-main"><div><Link to="/" className="footer-brand">PK<span>.</span></Link><p>Thoughtful engineering education begins with the courage to ask what comes next.</p></div><div><h3>Explore</h3><div className="footer-links"><Link to="/about">About us</Link><Link to="/academics">Academics</Link><Link to="/placements">Placements</Link><Link to="/gallery">Gallery</Link></div></div><div><h3>Connect</h3><p>{site.location}</p><a href={`mailto:${site.email}`}>{site.email}</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} PK Technology of Engineering</span><span>Developed by {site.developer}</span></div></div></footer>
  </div>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro"><div className="site-container"><div className="eyebrow light-eyebrow"><span className="eyebrow-line" />{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></section>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

export function EmptyContent({ title, description }: { title: string; description: string }) {
  return <div className="empty-content"><span className="empty-symbol">✳</span><h2>{title}</h2><p>{description}</p><Button asChild variant="outline" size="lg"><Link to="/contact">Contact the college <ArrowUpRight /></Link></Button></div>;
}

export function ContactBand() { return <section className="contact-band"><div className="site-container contact-band-inner"><div><span className="eyebrow light-eyebrow">THE NEXT STEP</span><h2>Start a conversation<br />about your future.</h2></div><Button asChild variant="light" size="lg"><Link to="/contact">Get in touch <ArrowUpRight /></Link></Button></div></section>; }
