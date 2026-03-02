'use client'

import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@/app/landing.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState<number | null>(4) // FAQ Item 5 (index 4) is initially open

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            offset: 100,
            easing: 'ease-in-out'
        })
    }, [])

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index)
    }

    const sliderSettings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true
    }

    const faqItems = [
        { question: 'What is Lorem Ipsum?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'Why do we use it?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'Where does it come from?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'Where can I get some?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'What is Lorem Ipsum?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'What is Lorem Ipsum?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'Where does it come from?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'Where can I get some?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' },
        { question: 'Where does it come from?', answer: 'NAME shortlists the most relevant candidates, automates first-round interviews, and generates easy-to-read reports. This allows recruiters to focus only on top talent, saving significant time and effort.' }
    ]

    return (
        <div className='landing-wrapper'>
            <div className='head-banner'>
                <Header />

                {/* ========== HERO/BANNER SECTION ========== */}
                <section id='home' className='hero-section'>
                    <div className='container'>
                        <div className='hero-wrapper'>
                            {/* Left Content */}
                            <div className='hero-content' data-aos='fade-up' data-aos-duration='1000'>
                                <h1 className='hero-title'>
                                    <span className='title-blue'>Digital invitations</span>
                                    <span className='title-black'>for your special</span>
                                    <span className='title-black'>occasion .</span>
                                </h1>
                                <p className='hero-description' data-aos='fade-up' data-aos-duration='1000' data-aos-delay='200'>
                                    Host your personal invitation and keep it always online for all kinds of events and celebrations.
                                </p>
                                <a href='#read-more' className='btn btn-secondary' data-aos='fade-up' data-aos-duration='1000' data-aos-delay='400'>
                                    Read More
                                </a>
                            </div>

                            {/* Right Visual - Phone Mockup with Decorative Shapes */}
                            <div className='hero-visual' data-aos='fade-left' data-aos-duration='1200' data-aos-delay='300'>
                                {/* Decorative Abstract Shapes */}
                                <div className='shape shape-purple-1'></div>
                                <div className='shape shape-green'></div>
                                <div className='shape shape-purple-2'></div>
                                <div className='shape shape-blue'></div>
                                <div className='shape shape-pink'></div>

                                {/* Phone Mockup */}
                                <div className='phone-mockup'>
                                    <img src='/images/Group 3.png' alt='Digital Invitation on Phone' className='phone-img' />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* ========== EVENTS TYPES SECTION ========== */}
            <section className='events-section'>
                <div className='container'>
                    <h2 className='section-title'>For all types of events</h2>
                    <div className='events-grid'>
                        {/* Event Cards */}
                        {[
                            { title: 'Wedding', icon: '/images/Mask group.png', delay: 0 },
                            { title: 'Festivals', icon: '/images/Mask group (1).png', delay: 100, featured: true },
                            { title: 'Birthday', icon: '/images/Mask group (2).png', delay: 200 },
                            { title: 'Graduations', icon: '/images/Mask group (3).png', delay: 300 },
                            { title: 'Art Exhibitions', icon: '/images/Mask group (4).png', delay: 200 },
                            { title: 'Corporate Events', icon: '/images/Mask group (5).png', delay: 200 }
                        ].map((event, idx) => (
                            <div
                                key={idx}
                                className={`event-card ${event.featured ? 'event-card-featured' : ''}`}
                                data-aos='zoom-in'
                                data-aos-duration='800'
                                data-aos-delay={event.delay}
                            >
                                <div className='event-icon'>
                                    <img src={event.icon} alt={event.title} className='event-icon-img' />
                                </div>
                                <h3 className='event-title'>{event.title}</h3>
                                <p className='event-description'>Lorem Ipsum is simply dummy text of dummy text ever since the 1500s</p>
                                <div className='event-arrow'>
                                    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M5 10H15M15 10L10 5M15 10L10 15' stroke='#0288D1' strokeWidth='2' strokeLinecap='round' />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== SHARED PHOTO ALBUM SECTION ========== */}
            <section className='photo-album-section'>
                <div className='container'>
                    <div className='photo-album-wrapper'>
                        {/* Left Content */}
                        <div className='photo-album-content' data-aos='fade-right' data-aos-duration='1000'>
                            <h2 className='feature-title'>Shared Photo Album</h2>
                            <p className='feature-description'>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Industry's standard dummy text ever since the 1500s
                            </p>
                            <ul className='feature-list'>
                                {['Guests Delighted', 'List of Attendance', 'Personalized just for me'].map((feature, idx) => (
                                    <li key={idx} className='feature-item'>
                                        <div className='checkmark-icon'>
                                            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <circle cx='12' cy='12' r='11' fill='#0288D1' />
                                                <path d='M7 12L10.5 15.5L17 9' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                            </svg>
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Visual - Phone Mockup */}
                        <div className='photo-album-visual' data-aos='fade-left' data-aos-duration='1000' data-aos-delay='200'>
                            <div className='deco-circle deco-blue'></div>
                            <div className='deco-circle deco-coral'></div>
                            <div className='deco-circle deco-pink'></div>
                            <div className='album-phone-mockup'>
                                <img src='/images/Group 4.png' alt='Photo Album on Phone' className='album-phone-img' />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== HOW DO WE WORK SECTION ========== */}
            <section className='how-work-section'>
                <div className='container'>
                    <h2 className='section-title'>How do we work?</h2>
                    <div className='process-grid'>
                        {[
                            {
                                num: 1,
                                title: 'Tell us your idea',
                                icon: (
                                    <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <circle cx='30' cy='35' r='12' stroke='white' strokeWidth='2.5' />
                                        <path d='M24 23L30 17L36 23' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                                        <line x1='30' y1='17' x2='30' y2='23' stroke='white' strokeWidth='2.5' strokeLinecap='round' />
                                    </svg>
                                )
                            },
                            {
                                num: 2,
                                title: 'Complete the questionnaire',
                                icon: (
                                    <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <rect x='20' y='15' width='20' height='30' rx='2' stroke='white' strokeWidth='2.5' />
                                        <path d='M24 22H32M24 28H32M24 34H28' stroke='white' strokeWidth='2.5' strokeLinecap='round' />
                                        <path d='M32 34L34 36L38 32' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                                    </svg>
                                )
                            },
                            {
                                num: 3,
                                title: 'Confirm your order',
                                icon: (
                                    <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M18 22H42L40 40H20L18 22Z' stroke='white' strokeWidth='2.5' strokeLinejoin='round' />
                                        <path d='M25 22V20C25 17.2 27.2 15 30 15C32.8 15 35 17.2 35 20V22' stroke='white' strokeWidth='2.5' />
                                        <path d='M26 32L28 34L34 28' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                                    </svg>
                                )
                            },
                            {
                                num: 4,
                                title: 'Custom design',
                                icon: (
                                    <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <rect x='16' y='18' width='28' height='20' rx='2' stroke='white' strokeWidth='2.5' />
                                        <line x1='16' y1='32' x2='44' y2='32' stroke='white' strokeWidth='2.5' />
                                        <path d='M24 26L26 28L30 24' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                        <line x1='20' y1='42' x2='40' y2='42' stroke='white' strokeWidth='2.5' strokeLinecap='round' />
                                    </svg>
                                )
                            },
                            {
                                num: 5,
                                title: 'Access the platform',
                                icon: (
                                    <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <rect x='16' y='16' width='28' height='22' rx='2' stroke='white' strokeWidth='2.5' />
                                        <line x1='16' y1='28' x2='44' y2='28' stroke='white' strokeWidth='2.5' />
                                        <rect x='22' y='20' width='6' height='4' rx='1' fill='white' />
                                        <rect x='30' y='20' width='6' height='4' rx='1' fill='white' />
                                        <rect x='22' y='32' width='6' height='4' rx='1' fill='white' />
                                        <line x1='20' y1='42' x2='40' y2='42' stroke='white' strokeWidth='2.5' strokeLinecap='round' />
                                    </svg>
                                )
                            },
                            {
                                num: 6,
                                title: 'Share and that\'s it',
                                icon: (
                                    <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M18 28L38 18L28 38L26 30L18 28Z' stroke='white' strokeWidth='2.5' strokeLinejoin='round' />
                                        <line x1='26' y1='30' x2='38' y2='18' stroke='white' strokeWidth='2.5' />
                                    </svg>
                                )
                            }
                        ].map((step, idx) => (
                            <div key={idx} className='process-card' data-aos='fade-up'>
                                <div className='step-number'>{step.num}</div>
                                <div className='step-icon'>{step.icon}</div>
                                <h3 className='step-title'>{step.title}</h3>
                                <p className='step-description'>Lorem Ipsum is simply dummy text of dummy text ever since the 1500s</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== REVIEWS SLIDER SECTION ========== */}
            <section className='reviews-section'>
                <div className='container'>
                    <h2 className='section-title'>Reviews</h2>
                    <div className='reviews-slider' data-aos='fade-up' data-aos-duration='1000'>
                        <Slider {...sliderSettings}>
                            {[1, 2, 3, 4].map((slideIdx) => (
                                <div key={slideIdx} className='reviews-slide'>
                                    <div className='reviews-grid'>
                                        {[1, 2, 3, 4].map((cardIdx) => (
                                            <div key={cardIdx} className='review-card'>
                                                <div className='reviewer-info'>
                                                    <img src={`/images/reviewer-${cardIdx}.png`} alt='Reviewer' className='reviewer-img' />
                                                    <div className='reviewer-details'>
                                                        <h4 className='reviewer-name'>Name Here</h4>
                                                        <p className='reviewer-event'>Wedding Event</p>
                                                    </div>
                                                </div>
                                                <div className='review-stars'>
                                                    {[1, 2, 3, 4, 5].map((star) => <span key={star} className='star'>★</span>)}
                                                </div>
                                                <p className='review-text'>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Industry's standard dummy text ever since the 1500s
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>

            {/* ========== FAQ ACCORDION SECTION ========== */}
            <section id='faq' className='faq-section'>
                <div className='container'>
                    <h2 className='section-title'>Do you have any questions?</h2>
                    <div className='faq-accordion'>
                        {faqItems.map((item, idx) => (
                            <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                                <button className='faq-question' onClick={() => toggleFaq(idx)}>
                                    <span>{item.question}</span>
                                    <span className='faq-icon'>{activeFaq === idx ? '-' : '+'}</span>
                                </button>
                                <div className='faq-answer'>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LandingPage
