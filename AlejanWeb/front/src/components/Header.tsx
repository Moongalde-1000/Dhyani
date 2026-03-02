'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
    const [isSticky, setIsSticky] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Robust scroll handler using requestAnimationFrame for performance and accuracy
    const handleScroll = useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || document.body.scrollTop || 0
        if (scrollTop > 10) {
            setIsSticky(true)
        } else {
            setIsSticky(false)
        }
    }, [])

    useEffect(() => {
        // Initial check
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })

        // Also listen on document for weird scroll environments
        document.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    // Re-check scroll on pathname change (in case new page is long/short)
    useEffect(() => {
        handleScroll()
    }, [pathname, handleScroll])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about-us' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact Us', href: '/contact-us' },
    ]

    // Improved Active Link logic with trailing slash normalization
    const checkActive = (href: string) => {
        if (!pathname) return false

        const normalizedPath = pathname.endsWith('/') && pathname.length > 1
            ? pathname.slice(0, -1)
            : pathname

        const normalizedHref = href.endsWith('/') && href.length > 1
            ? href.slice(0, -1)
            : href

        if (normalizedHref === '/') return normalizedPath === '/'
        return normalizedPath.startsWith(normalizedHref)
    }

    return (
        <header className={`header ${isSticky ? 'sticky' : ''}`}>
            <div className='container-fluid'>
                <nav className='navbar'>
                    {/* Logo */}
                    <Link href='/' className='logo' onClick={closeMobileMenu}>
                        <img src='/images/logof 1.png' alt='Digital Evento Logo' className='logo-img' />
                    </Link>

                    {/* Navigation Menu */}
                    <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} id='navMenu'>
                        {navItems.map((item) => {
                            const isActive = checkActive(item.href)
                            return (
                                <li key={item.name} className='nav-item'>
                                    <Link
                                        href={item.href}
                                        className={`nav-link ${isActive ? 'active' : ''}`}
                                        onClick={closeMobileMenu}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Client Login Button */}
                    <div className='header-cta'>
                        <Link href='/login' className='btn btn-primary'>Client Login</Link>
                    </div>

                    {/* Mobile Menu Toggle (Hamburger) */}
                    <div className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} id='mobileMenuToggle' onClick={toggleMobileMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header
