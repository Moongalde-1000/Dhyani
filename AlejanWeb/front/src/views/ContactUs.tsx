'use client'

import React, { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AOS from 'aos'
import 'aos/dist/aos.css'
import '@/app/landing.css'

const ContactUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            offset: 100,
            easing: 'ease-in-out'
        })
    }, [])

    const contactDetails = [
        {
            title: 'Email Address',
            value: 'info@emailaddress.com',
            icon: '/images/Mask group (12).png',
            bg: '#09D1C4',
            class: 'teal'
        },
        {
            title: 'Phone',
            value: '+012 242 2452',
            icon: '/images/Mask group (13).png',
            bg: '#6A6CDB',
            class: 'purple'
        },
        {
            title: 'Address',
            value: '20 Cooper Square, New York, NY 10003, USA',
            icon: '/images/Mask group (14).png',
            bg: '#ff6b6b',
            class: 'red'
        }
    ]

    return (
        <div className='landing-wrapper'>
            <div className='head-banner'>
                <Header />

                {/* ========== HERO/BANNER SECTION ========== */}
                <section className='hero-section sub-banner contact-bnr'>
                    <div className='container'>
                        <div className='hero-content' data-aos='fade-up' data-aos-duration='1000'>
                            <h1 className='hero-title'>
                                <span className='title-black'>Contact Us</span>
                            </h1>
                            <p className='hero-description'>Lorem Ipsum is simply dummy text</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* ========== CONTACT FORM SECTION ========== */}
            <section className='contact-section' style={{ padding: '80px 0' }}>
                <div className='container'>
                    <form className='contact-form' data-aos='fade-up' style={{ maxWidth: '900px', margin: 'auto' }}>
                        <input
                            type='text'
                            placeholder='Name'
                            required
                            style={{ width: '100%', padding: '14px 16px', marginBottom: '18px', border: '1.5px solid #0072CF', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                        />
                        <input
                            type='email'
                            placeholder='Email Address'
                            required
                            style={{ width: '100%', padding: '14px 16px', marginBottom: '18px', border: '1.5px solid #0072CF', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                        />
                        <input
                            type='tel'
                            placeholder='Phone'
                            required
                            style={{ width: '100%', padding: '14px 16px', marginBottom: '18px', border: '1.5px solid #0072CF', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                        />
                        <textarea
                            rows={5}
                            placeholder='Subject'
                            required
                            style={{ width: '100%', padding: '14px 16px', marginBottom: '18px', border: '1.5px solid #0072CF', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                        ></textarea>
                        <button
                            type='submit'
                            style={{ background: 'linear-gradient(135deg, #FF7B7B 0%, #FF6B6B 100%)', border: 'none', padding: '16px 60px', color: '#fff', fontSize: '15px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </section>

            {/* ========== CONTACT DETAILS SECTION ========== */}
            <section className='goal-section goal-section-two' style={{ padding: '40px 0 80px', textAlign: 'center' }}>
                <div className='container'>
                    <div className='goal-wrapper' style={{ display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
                        {contactDetails.map((detail, idx) => (
                            <div key={idx} className='goal-box' data-aos='zoom-in' data-aos-delay={(idx + 1) * 100} style={{ width: '33.33%', maxWidth: '260px' }}>
                                <div className={`icon ${detail.class}`} style={{ background: detail.bg, width: '120px', height: '120px', margin: 'auto', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                                    <img src={detail.icon} alt={detail.title} style={{ width: '42px' }} />
                                </div>
                                <h3 style={{ fontSize: '24px', color: '#0072CF', marginBottom: '10px' }}>{detail.title}</h3>
                                <p style={{ fontSize: '16px', color: '#000' }}>{detail.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== MAP SECTION ========== */}
            <section className='map' style={{ width: '100%', fontSize: 0 }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3040556.6812098934!2d-96.03090305850186!3d41.90804604404211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87ee5e6ff1f86019%3A0xc6ef634a57c759d9!2sIowa%2C%20USA!5e0!3m2!1sen!2sin!4v1771438850655!5m2!1sen!2sin"
                    style={{ border: 0, width: '100%', height: '500px', marginBottom: '80px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>

            <Footer />
        </div>
    )
}

export default ContactUs
