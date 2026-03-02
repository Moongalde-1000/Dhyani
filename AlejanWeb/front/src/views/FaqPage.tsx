'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AOS from 'aos'
import 'aos/dist/aos.css'
import '@/app/landing.css'

const FaqPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(4) // Index 4 (Item 5) initially open

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            offset: 100,
            easing: 'ease-in-out'
        })
    }, [])

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

    const toggleFaq = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx)
    }

    return (
        <div className='landing-wrapper'>
            <div className='head-banner'>
                <Header />

                {/* ========== HERO/BANNER SECTION ========== */}
                <section className='hero-section sub-banner'>
                    <div className='container'>
                        <div className='hero-content' data-aos='fade-up' data-aos-duration='1000'>
                            <h1 className='hero-title'>
                                <span className='title-black'>FAQ</span>
                            </h1>
                            <p className='hero-description'>Lorem Ipsum is simply dummy text</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* ========== FAQ ACCORDION SECTION ========== */}
            <section className='faq-section faq-page'>
                <div className='container'>
                    <div className='faq-accordion' style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {faqItems.map((item, idx) => (
                            <div key={idx} className={`faq-item ${openIndex === idx ? 'active' : ''}`}>
                                <button className='faq-question' onClick={() => toggleFaq(idx)}>
                                    <span>{item.question}</span>
                                    <span className='faq-icon'>{openIndex === idx ? '-' : '+'}</span>
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

export default FaqPage
