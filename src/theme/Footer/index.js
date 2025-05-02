import React from 'react';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import styles from './styles.module.css';

function FooterLink({to, href, label, prependBaseUrlToHref, ...props}) {
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});

  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {label}
    </Link>
  );
}

function FooterLogo({sources, alt}) {
  const source = sources.src;
  const srcUrl = useBaseUrl(source);
  return (
    <div className={styles.footerLogoWrapper}>
      <img src={srcUrl} alt={alt} className={styles.footerLogo} />
      <span className={styles.footerLogoText}>Publiish</span>
    </div>
  );
}

function Footer() {
  const {footer} = useThemeConfig();
  const {copyright, links = [], logo = {}} = footer || {};
  const sources = {
    src: logo.src,
  };

  if (!footer) {
    return null;
  }

  return (
    <footer className="footer footer--dark">
      <div className="container container-fluid">
        {links && links.length > 0 && (
          <div className="row footer__links">
            {links.map((linkItem, i) => (
              <div key={i} className="col footer__col">
                {linkItem.title != null ? (
                  <div className="footer__title">{linkItem.title}</div>
                ) : null}
                {linkItem.items != null &&
                Array.isArray(linkItem.items) &&
                linkItem.items.length > 0 ? (
                  <ul className="footer__items">
                    {linkItem.items.map((item, key) =>
                      item.html ? (
                        <li
                          key={key}
                          className="footer__item"
                          dangerouslySetInnerHTML={{
                            __html: item.html,
                          }}
                        />
                      ) : (
                        <li key={item.href || item.to} className="footer__item">
                          <FooterLink {...item} />
                        </li>
                      ),
                    )}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}
        <div className="footer__bottom text--center">
          {logo && logo.src && (
            <div className={styles.footerLogoSection}>
              <FooterLogo
                alt={logo.alt}
                sources={sources}
              />
            </div>
          )}
          {copyright ? (
            <div
              className="footer__copyright"
              dangerouslySetInnerHTML={{
                __html: copyright,
              }}
            />
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export default Footer; 