import { ChevronRight } from 'lucide-react';
import Studios from './Studios';
import styles from './Footer.module.css';

// Custom SVG Brand Icons since Lucide v1.0+ removed brand trademarks
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const FOOTER_LINKS = [
  { label: 'Get the Omni App', href: '#' },
  { label: 'Help', href: '#' },
  { label: 'Site Index', href: '#' },
  { label: 'Omni Pro', href: '#' },
  { label: 'Advertising', href: '#' },
  { label: 'Omni Developer', href: '#' },
  { label: 'Jobs', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: '#', name: 'Facebook' },
  { icon: InstagramIcon, href: '#', name: 'Instagram' },
  { icon: LinkedinIcon, href: '#', name: 'LinkedIn' },
  { icon: YoutubeIcon, href: '#', name: 'YouTube' },
  { icon: TelegramIcon, href: '#', name: 'Telegram' },
];

function Footer({ isKidsPage = false }) {
  return (
    <footer className={styles.footer}>
      {/* Studios grid inside Footer */}
      {!isKidsPage && <Studios />}

      {/* Links section */}
      <div className={styles.footer__container}>
        {isKidsPage && (
          <div className={styles['footer__kids-see-more-wrap']}>
            <button type="button" className={styles['footer__kids-see-more']}>
              See More
            </button>
          </div>
        )}

        <div className={styles.footer__links}>
          {FOOTER_LINKS.map((link, idx) => (
            <a key={idx} href={link.href} className={styles.footer__link}>
              {link.label}
              <ChevronRight size={14} className={styles.footer__chevron} />
            </a>
          ))}
        </div>

        {/* Social links section */}
        <div className={styles.footer__socials}>
          {SOCIAL_LINKS.map((social, idx) => {
            const Icon = social.icon;
            return (
              <a
                key={idx}
                href={social.href}
                className={social.name === 'Telegram' ? [styles.footer__social, styles['footer__social--telegram']].join(' ') : styles.footer__social}
                aria-label={social.name}
                title={social.name}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        {/* Copyright notice */}
        <div className={styles.footer__copyright}>
          <p>© {new Date().getFullYear()} Omni Entertainment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
