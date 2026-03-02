'use client'

import React from 'react'
import Link from 'next/link'

const Footer = () => {
    const footerLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about-us' },
        { name: 'FAQ', href: '/faq' },
    ]

    const additionalLinks = [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms-and-conditions' },
        { name: 'Contact Us', href: '/contact-us' },
    ]

    return (
        <footer id='contact' className='footer'>
            <div className='container'>
                <div className='footer-content'>
                    {/* Brand Column */}
                    <div className='footer-column footer-brand'>
                        <h3 className='footer-logo'>Digital Evento</h3>
                        <p className='footer-description'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy ...
                        </p>
                    </div>

                    {/* Useful Links Column */}
                    <div className='footer-column'>
                        <h4 className='footer-heading'>Useful Links</h4>
                        <ul className='footer-links'>
                            {footerLinks.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Additional Links Column */}
                    <div className='footer-column'>
                        <h4 className='footer-heading' style={{ opacity: 0 }}>Hidden</h4>
                        <ul className='footer-links'>
                            {additionalLinks.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Media Column */}
                    <div className='footer-column footer-social'>
                        <h4 className='footer-heading'>Lets Connect</h4>
                        <div className='social-icons'>
                            <a href='#' className='social-icon' aria-label='LinkedIn'>
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path
                                        d='M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z'
                                        stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
                                    />
                                    <path d='M8.5 10V16' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    <path d='M8.5 7.5V7.51' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    <path d='M12 16V13C12 11.8954 12.8954 11 14 11C15.1046 11 16 11.8954 16 13V16' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    <path d='M12 10V16' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                </svg>
                            </a>
                            <a href='#' className='social-icon' aria-label='Twitter/X'>
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' fill='currentColor' />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Bottom */}
                <div className='footer-bottom'>
                    <p className='copyright'>Copyright © 2025 Digital Evento</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
