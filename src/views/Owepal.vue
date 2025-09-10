<template>
  <!-- Navigation Bar -->
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        OwePal
      </router-link>
    </div>
  </nav>
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">Take Control of Your Debts</h1>
      <p class="hero-description">
        OwePal helps you track what you owe and budget your money, set reminders, 
        and achieve financial clarity with ease.
      </p>
      <div class="hero-buttons">
        <router-link to="/login" class="btn btn-primary btn-lg">
          Get Started 
        </router-link>
        <router-link to="/login" class="btn btn-secondary btn-lg">
          Log In
        </router-link>
      </div>
    </div>
    <div class="hero-visual">
      <div class="dashboard-preview">
        <div class="preview-header">
          <div class="preview-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="preview-content">
          <div class="preview-card debt-card">
            <div class="card-header">
              <span>Mortgage</span>
              <span>$1,250/mo</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 65%"></div>
            </div>
          </div>
          <div class="preview-card debt-card">
            <div class="card-header">
              <span>Car Loan</span>
              <span>$385/mo</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 40%"></div>
            </div>
          </div>
          <div class="preview-card summary-card">
            <span>Total Debt: $45,230</span>
            <span>Projected Free: Aug 2026</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features-section">
    <div class="section-header">
      <h2 class="section-title">Why Choose OwePal?</h2>
      <p class="section-subtitle">
        Simplify your financial life with tools designed to help you manage debts effortlessly.
      </p>
    </div>
    <div class="features-grid">
      <div class="feature-item">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
          </svg>
        </div>
        <h3>Track Debts</h3>
        <p>Easily record and monitor debts you owe or are owed, all in one organized place.</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
          </svg>
        </div>
        <h3>Smart Reminders</h3>
        <p>Set customizable reminders to stay on top of payment due dates and never miss a deadline.</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20 V4 H6 L8 10 L10 6 L12 12 L14 8 L16 14 L18 10 L20 16 H22" />
            <rect x="4" y="16" width="2" height="4" />
            <rect x="6" y="14" width="2" height="6" />
            <rect x="8" y="12" width="2" height="8" />
            <rect x="10" y="10" width="2" height="10" />
            <rect x="12" y="8" width="2" height="12" />
            <rect x="14" y="6" width="2" height="14" />
            <rect x="16" y="4" width="2" height="16" />
          </svg>
        </div>
        <h3>Debt Analytics</h3>
        <p>Gain insights with clear visualizations of your debt progress and repayment trends.</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
        </div>
        <h3>Personalized Profiles</h3>
        <p>Manage your debt tracking with a secure, user-friendly profile tailored to you.</p>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq-section">
    <div class="section-header">
      <h2 class="section-title">Frequently Asked Questions</h2>
    </div>
    <div class="faq-container">
      <div class="faq-item">
        <button class="faq-question">
          Is my financial data secure with OwePal?
         
        </button>
        <div class="faq-answer">
          <p>Yes, we use bank-level encryption and never store your owe. Your data is always protected.</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">
          Can I use OwePal outside the United States?
         
        </button>
        <div class="faq-answer">
          <p>Absolutely No! OwePal works with an specific currency and can't be used anywhere in the world.</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">
          How often is my debt information updated?
        
        </button>
        <div class="faq-answer">
          <p>Your information updates in real-time as you make changes. For connected accounts, we refresh data daily.</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">
          Can I share my debt progress with others?
    
        </button>
        <div class="faq-answer">
          <p>With our Family plan, you can share progress with family members or financial advisors while maintaining privacy controls.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Call to Action Section -->
  <section class="cta-section">
    <div class="cta-container">
      <h2 class="cta-title">Ready to Take Control of Your Debt?</h2>
      <div class="cta-buttons">
        <router-link to="/login" class="btn btn-primary btn-lg">
          Get Started
        </router-link>
      </div>
    </div>
  </section>

  <AiAssistant />
</template>

<script setup>
import { inject } from 'vue'
import AiAssistant from '../components/AiAssistant.vue'

const darkMode = inject('darkMode')
</script>

<style scoped>
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif !important;
  line-height: 1.6;
  
  overflow-x: hidden;
}

/* Navbar Styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  z-index: 1000;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: center; /* centers .navbar-container */
}

.navbar-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar-logo:hover {
  color: #2563eb; /* darker shade on hover */
}

/* Hero Section */
.hero-section { 
  min-height: 90vh;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  gap: 3rem;
}

.hero-content {  
    margin-top: -6rem;   
  flex: 1;
  text-align: left;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: #1a202c;
}

.hero-description {
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
  color: #4a5568;
  margin-bottom: 2.5rem;
  max-width: 500px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dashboard-preview {
  width: 100%;
  margin-top: -6rem;   
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-header {
  background: #f8fafc;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.preview-dots {
  display: flex;
  gap: 0.5rem;
}

.preview-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
}

.preview-dots span:first-child {
  background: #f56565;
}

.preview-dots span:nth-child(2) {
  background: #f6e05e;
}

.preview-dots span:last-child {
  background: #48bb78;
}

.preview-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-card {
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.debt-card .card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
}

.summary-card {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Stats Section */
.stats-section {
      margin-top: -12rem;   
  background: #f8fafc;
  padding: 4rem 1.5rem;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-item p {
  color: #4a5568;
  font-weight: 500;
}

/* Features Section */
.features-section {
  padding: 6rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
       margin-top: -6rem;   
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
    
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #4a5568;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
}

.feature-item {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.feature-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
}

.feature-item p {
  color: #4a5568;
  line-height: 1.6;
}

/* Testimonials Section */
.testimonials-section {
  background: #f8fafc;
  padding: 6rem 1.5rem;
}

.testimonials-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.testimonial-content {
  margin-bottom: 2rem;
}

.testimonial-content p {
  font-style: italic;
  color: #4a5568;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e2e8f0;
}

.author-details h4 {
  font-weight: 600;
  color: #1a202c;
}

.author-details p {
  color: #718096;
  font-size: 0.875rem;
}

/* Pricing Section */
.pricing-section {
  padding: 6rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.pricing-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.pricing-card.featured {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
}

.pricing-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pricing-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
}

.price span {
  font-size: 1rem;
  color: #718096;
  font-weight: 400;
}

.pricing-features {
  list-style: none;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.pricing-features li {
  padding: 0.5rem 0;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.pricing-features li:before {
  content: "✓";
  color: #48bb78;
  margin-right: 0.5rem;
  font-weight: bold;
}

/* FAQ Section */
.faq-section {
  padding: 6rem 1.5rem;
  background: #f8fafc;
  max-width: 1200px;
  margin: 0 auto;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.faq-question {
  width: 100%;
  padding: 1.5rem 0;
  text-align: left;
  background: none;
  border: none;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.faq-answer {
  padding-bottom: 1.5rem;
  color: #4a5568;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {

  padding: 6rem 1.5rem;
  color: rgb(24, 24, 24);
  text-align: center;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.cta-subtitle {
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.1);
}

.btn-outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #4a5568;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-outline-light {
  background: transparent;
  border: 1px solid white;
  color: white;
}

.btn-outline-light:hover {
  background: white;
  color: #3b82f6;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Dark Mode Support */
[data-bs-theme='dark'] .navbar {
  background: rgba(26, 32, 44, 0.95);
  border-bottom-color: #2d3748;
}

[data-bs-theme='dark'] .nav-link {
  color: #cbd5e0;
}

[data-bs-theme='dark'] .nav-link:hover {
  color: #60a5fa;
}

[data-bs-theme='dark'] .hero-title {
  color: #f7fafc;
}

[data-bs-theme='dark'] .hero-description {
  color: #cbd5e0;
}

[data-bs-theme='dark'] .dashboard-preview {
  background: #2d3748;
}

[data-bs-theme='dark'] .preview-header {
  background: #1a202c;
  border-bottom-color: #2d3748;
}

[data-bs-theme='dark'] .preview-card {
  background: #1a202c;
  border-color: #2d3748;
}

[data-bs-theme='dark'] .stats-section {
  background: #1a202c;
}

[data-bs-theme='dark'] .stat-item p {
  color: #cbd5e0;
}

[data-bs-theme='dark'] .feature-item {
  background: #1a202c;
}

[data-bs-theme='dark'] .feature-item:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

[data-bs-theme='dark'] .feature-icon {
  background: #2d3748;
}

[data-bs-theme='dark'] .feature-item h3 {
  color: #f7fafc;
}

[data-bs-theme='dark'] .feature-item p {
  color: #cbd5e0;
}

[data-bs-theme='dark'] .testimonials-section {
  background: #1a202c;
}

[data-bs-theme='dark'] .testimonial-card {
  background: #2d3748;
}

[data-bs-theme='dark'] .testimonial-content p {
  color: #cbd5e0;
}

[data-bs-theme='dark'] .author-details h4 {
  color: #f7fafc;
}

[data-bs-theme='dark'] .pricing-card {
  background: #2d3748;
  border-color: #2d3748;
}

[data-bs-theme='dark'] .pricing-header h3 {
  color: #f7fafc;
}

[data-bs-theme='dark'] .price {
  color: #f7fafc;
}

[data-bs-theme='dark'] .pricing-features li {
  color: #cbd5e0;
}

[data-bs-theme='dark'] .faq-section {
  background: #1a202c;
}

[data-bs-theme='dark'] .faq-question {
  color: #f7fafc;
}

[data-bs-theme='dark'] .faq-answer {
  color: #cbd5e0;
}
/* Tablet & below */
@media (max-width: 768px) {
    
  .nav-menu {
    display: none;
  }

  /* Hero section fixes */
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .hero-content {
        padding-top: -.3rem; /* spacing below fixed navbar */
    margin-top: 0; /* remove negative margin */
    text-align: left;
  }

  .hero-description {
    margin: 0 auto 2rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-visual {
    margin-top: 6rem;
  }

  .section-header {
    margin-top: -3rem;   
}

}

/* Tablet & below */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  /* Hero section fixes */
  .hero-section {
    flex-direction: column;
    text-align: left; /* all text left */
    gap: 2rem;
  }

  .hero-content {

    padding-top: 0; /* remove weird negative padding */
    margin-top: -3rem;
    text-align: left;
  }

  .hero-description {
    margin: 0 0 2rem 0; /* flush left */
    text-align: left;
  }

  .hero-buttons {
    justify-content: flex-start; /* buttons aligned left */
  }

  .hero-visual {
    margin-top: 8rem; /* separate image from text */
  }

  .section-header {
    margin-top: -3rem;
    text-align: left; /* align left */
  }

}

/* Phones */
@media (max-width: 576px) {
  /* Hero section */
  .hero-section {
    padding-top: 5rem;
    gap: 1.5rem;
    text-align: left;
  }

  .hero-title {
    font-size: 2rem;
    text-align: left;
  }

  .hero-description {
    font-size: 1rem;
    text-align: left;
  }

  .hero-buttons {
    justify-content: flex-start;
  }

  /* Optional: make FAQ, stats, CTA all left aligned */
  .faq-section,
  .faq-question,
  .faq-answer,
  .stat-item {
    text-align: left;
  }
}



</style>