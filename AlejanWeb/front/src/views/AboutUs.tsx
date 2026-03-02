'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AOS from 'aos'
import 'aos/dist/aos.css'
import '@/app/landing.css'

const AboutUs = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            offset: 100,
            easing: 'ease-in-out'
        })
    }, [])

    const goals = [
        {
            title: 'Our Mission',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            icon: '/images/Mask group (9).png',
            colorClass: 'teal'
        },
        {
            title: 'Our Vision',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            icon: '/images/Mask group (6).png',
            colorClass: 'purple'
        },
        {
            title: 'Our Values',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            icon: '/images/Mask group (8).png',
            colorClass: 'red'
        }
    ]

    // Each slide contains 4 team members (matching the HTML slick slider structure)
    const teamSlides = [
        [
            { name: 'John Siffa', role: 'Co-Founder', image: '/images/Rectangle 191.png' },
            { name: 'Carlo Smith', role: 'Web Builder', image: '/images/Rectangle 193.png' },
            { name: 'Bill Mark', role: 'Team Builder', image: '/images/Rectangle 196.png' },
            { name: 'Kevin Al', role: 'Team Builder', image: '/images/Rectangle 197.png' }
        ],
        [
            { name: 'John Siffa', role: 'Co-Founder', image: '/images/Rectangle 191.png' },
            { name: 'Carlo Smith', role: 'Web Builder', image: '/images/Rectangle 193.png' },
            { name: 'Bill Mark', role: 'Team Builder', image: '/images/Rectangle 196.png' },
            { name: 'Kevin Al', role: 'Team Builder', image: '/images/Rectangle 197.png' }
        ],
        [
            { name: 'John Siffa', role: 'Co-Founder', image: '/images/Rectangle 191.png' },
            { name: 'Carlo Smith', role: 'Web Builder', image: '/images/Rectangle 193.png' },
            { name: 'Bill Mark', role: 'Team Builder', image: '/images/Rectangle 196.png' },
            { name: 'Kevin Al', role: 'Team Builder', image: '/images/Rectangle 197.png' }
        ],
        [
            { name: 'John Siffa', role: 'Co-Founder', image: '/images/Rectangle 191.png' },
            { name: 'Carlo Smith', role: 'Web Builder', image: '/images/Rectangle 193.png' },
            { name: 'Bill Mark', role: 'Team Builder', image: '/images/Rectangle 196.png' },
            { name: 'Kevin Al', role: 'Team Builder', image: '/images/Rectangle 197.png' }
        ]
    ]

    return (
        <div className='landing-wrapper'>
            <div className='head-banner'>
                <Header />

                {/* ========== HERO/BANNER SECTION ========== */}
                <section className='hero-section sub-banner'>
                    <div className='container'>
                        <div className='hero-content' data-aos='fade-up' data-aos-duration='1000'>
                            <h1 className='hero-title'>
                                <span className='title-black'>About Us</span>
                            </h1>
                            <p>Lorem Ipsum is simply dummy text</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* ========== PARTY SECTION (Image + Content) ========== */}
            <section className='party-section'>
                <div className='d-flex'>
                    {/* LEFT IMAGE — bleeds to left edge, no padding */}
                    <div className='image-box' data-aos='fade-right'>
                        <img src='/images/image 4.png' alt='Birthday Party' />
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className='content-box' data-aos='fade-left'>
                        <h2>Title Here</h2>
                        <p className='desc'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type
                            specimen book.
                        </p>
                        <p className='desc'>
                            It has survived not only five centuries, but also the leap into electronic
                            typesetting, remaining essentially unchanged. It was popularised in the
                            1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                            and more recently with desktop publishing software like Aldus PageMaker.
                        </p>
                        <a href='#' className='btn btn-primary'>Read More</a>
                    </div>
                </div>
            </section>

            {/* ========== GOAL SECTION ========== */}
            <section className='goal-section'>
                <div className='container'>
                    <div className='section-title' data-aos='fade-up'>
                        <h2>Our Goal</h2>
                        <p>Lorem Ipsum is simply dummy text</p>
                    </div>

                    <div className='goal-wrapper'>
                        {goals.map((goal, idx) => (
                            <div key={idx} className='goal-box' data-aos='zoom-in' data-aos-delay={(idx + 1) * 100}>
                                <div className={`icon ${goal.colorClass}`}>
                                    <img src={goal.icon} alt={goal.title} />
                                </div>
                                <h3>{goal.title}</h3>
                                <p>{goal.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== TEAM SECTION — Dot Slider (matches HTML slick) ========== */}
            <section className='team-section'>
                <div className='container'>
                    <div className='section-title' data-aos='fade-up'>
                        <h2>Meet Our Team</h2>
                    </div>

                    <div className='team-slider-main'>
                        {/* Slides */}
                        <div className='team-slides-track' style={{ position: 'relative', overflow: 'hidden' }}>
                            {teamSlides.map((slide, slideIdx) => (
                                <div
                                    key={slideIdx}
                                    className='team-slider'
                                    style={{
                                        display: currentSlide === slideIdx ? 'flex' : 'none'
                                    }}
                                >
                                    {slide.map((member, idx) => (
                                        <div key={idx} className='team-card'>
                                            <img src={member.image} alt={member.name} />
                                            <div className='team-info'>
                                                <div>
                                                    <h4>{member.name}</h4>
                                                    <p>{member.role}</p>
                                                </div>
                                                <div className='icons'>
                                                    <span>
                                                        <img src='/images/Mask group (10).png' alt='linkedin' />
                                                    </span>
                                                    <span>
                                                        <img src='/images/Mask group (11).png' alt='twitter' />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Dots */}
                        <ul className='team-dots'>
                            {teamSlides.map((_, idx) => (
                                <li key={idx}>
                                    <button
                                        className={currentSlide === idx ? 'active' : ''}
                                        onClick={() => setCurrentSlide(idx)}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default AboutUs
