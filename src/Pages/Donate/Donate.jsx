import React from "react";
import "./Donate.css";
import { IoPaw } from "react-icons/io5";
import { PiBirdFill } from "react-icons/pi";
import { FaCat } from "react-icons/fa";
import { FaDog } from "react-icons/fa";
import { GiSquirrel } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import { FaHandHoldingHeart } from "react-icons/fa";

const Donate = () => {
  return (
    <section className="donate-page">
      {/* Floating/Background Icons */}
      <IoPaw className="floating-icon icon-1" />
      <IoPaw className="floating-icon icon-2" />
      <IoPaw className="floating-icon icon-3" />
      <IoPaw className="floating-icon icon-4" />
      <PiBirdFill className="floating-icon bird-1" />
      <PiBirdFill className="floating-icon bird-2" />
      <FaCat className="floating-icon cat-1" />
      <FaDog className="floating-icon dog-1" />
      <GiSquirrel className="floating-icon squirrel-1" />
      <FaHandHoldingHeart className="floating-icon heart-1" />

      {/* Page Title */}
      <h2 className="donate-title">Support Our Mission</h2>

      {/* Intro */}
      <p className="donate-intro">
        Your generous donations help <strong>Noah's Ark</strong> continue our vital work of rescuing, 
        caring for, and finding homes for animals in need. Every contribution, no matter the size, 
        makes a real difference in the lives of animals who depend on us. Together, we can provide 
        safety, medical care, and love to those who need it most.
      </p>

      {/* Why Donate */}
      <div className="donate-section">
        <h3 className="section-title">
          Why Your Donation Matters
          <span className="heart-heading">
            <FaHeart />
          </span>
        </h3>
        <ul className="donate-list">
          <li>Provide medical care and treatment for sick or injured animals</li>
          <li>Cover food, shelter, and daily care costs for rescued animals</li>
          <li>Support our adoption and foster care programs</li>
          <li>Fund emergency rescues and urgent interventions</li>
          <li>Maintain and improve our shelter facilities</li>
          <li>Help us reach more animals in need across Israel</li>
        </ul>
      </div>

      {/* Ways to Donate */}
      <div className="donate-section">
        <h3 className="section-title">
          Ways to Donate
          <span className="paw-heading">
            <IoPaw />
          </span>
        </h3>
        <div className="donation-item">
          <h4 className="donation-title">One-Time Donation</h4>
          <p className="section-text">
            Make a single contribution to support our immediate needs. Every donation helps us 
            provide care for animals right now.
          </p>
        </div>
        <div className="donation-item">
          <h4 className="donation-title">Monthly Recurring Donation</h4>
          <p className="section-text">
            Set up a monthly donation to provide consistent support for our ongoing operations. 
            Regular contributions help us plan and maintain our programs.
          </p>
        </div>
        <div className="donation-item">
          <h4 className="donation-title">Sponsor an Animal</h4>
          <p className="section-text">
            Choose to sponsor a specific animal's care, medical treatment, or rehabilitation. 
            You'll receive updates on their progress and journey.
          </p>
        </div>
        <div className="donation-item">
          <h4 className="donation-title">In-Kind Donations</h4>
          <p className="section-text">
            Donate supplies such as food, blankets, toys, cleaning supplies, or medical equipment. 
            Contact us to see what items we currently need most.
          </p>
        </div>
        <div className="donation-item">
          <h4 className="donation-title">Memorial or Tribute Gifts</h4>
          <p className="section-text">
            Honor a loved one or beloved pet with a memorial donation. We'll acknowledge your 
            thoughtful gift appropriately.
          </p>
        </div>
      </div>

      {/* What Your Donation Supports */}
      <div className="donate-section">
        <h3 className="section-title">
          What Your Donation Supports
          <span className="bird-heading">
            <PiBirdFill />
          </span>
        </h3>
        <p className="section-text">
          Every donation, regardless of size, makes a meaningful difference in the lives of animals in need. 
          Your contribution helps us provide:
        </p>
        <ul className="donate-list">
          <li>Food, shelter, and daily care for rescued animals</li>
          <li>Medical treatment, vaccinations, and emergency care</li>
          <li>Rehabilitation programs for animals recovering from trauma</li>
          <li>Adoption and foster care support services</li>
          <li>Emergency rescue operations and urgent interventions</li>
          <li>Facility maintenance and improvements to better serve our animals</li>
          <li>Outreach programs to help more animals in need across Israel</li>
        </ul>
        <p className="section-text">
          We are grateful for any amount you can give. Every contribution helps us continue our mission 
          of providing safety, care, and love to animals who need it most.
        </p>
      </div>

      {/* How to Donate */}
      <div className="donate-section">
        <h3 className="section-title">
          How to Donate
          <span className="paw-heading">
            <IoPaw />
          </span>
        </h3>
        <ol className="donate-list numbered">
          <li>Choose your donation amount and frequency</li>
          <li>Select your preferred payment method (credit card, bank transfer, or PayPal)</li>
          <li>Complete the secure donation form</li>
          <li>Receive a confirmation and tax receipt (where applicable)</li>
          <li>Know that your contribution is making a real difference!</li>
        </ol>
      </div>

      {/* Contact */}
      <div className="donate-section">
        <h3 className="section-title">
          Ready to Make a Difference?
          <span className="heart-heading">
            <FaHandHoldingHeart />
          </span>
        </h3>
        <p className="section-text">
          Your support enables us to continue our mission of saving and caring for animals in need. 
          Every donation, no matter the size, helps us provide safety, medical care, and love to 
          animals who depend on us.
        </p>
        <p className="section-text">
          <strong>Donation Information:</strong><br />
          Email: donations@noahsark.org<br />
          Phone: (02) 123-4567<br />
          Visit us at the shelter to make a donation in person, or contact us for information about 
          in-kind donations and other ways to support our work.
        </p>
        <p className="section-text">
          <strong>Online Donations:</strong> You can also donate directly online using PayPal. 
          Click the PayPal button below to make a secure donation without needing to contact us first.
        </p>
        <p className="section-text">
          <strong>Tax Deductible:</strong> Noah's Ark is a registered non-profit organization. 
          Donations may be tax-deductible according to local regulations. Please consult with a 
          tax advisor for specific information.
        </p>
      </div>

      {/* PayPal Donation Section */}
      <div className="donate-section paypal-section">
        <h3 className="section-title">
          Donate Online with PayPal
          <span className="heart-heading">
            <FaHandHoldingHeart />
          </span>
        </h3>
        <p className="section-text">
          Make a secure donation instantly using PayPal. No need to contact us first - you can 
          donate any amount you're comfortable with right now. Your donation will be processed 
          securely and you'll receive a confirmation email.
        </p>
        <div className="paypal-button-container">
          <form action="https://www.paypal.com/donate" method="post" target="_top" className="paypal-form">
            <input type="hidden" name="hosted_button_id" value="YOUR_PAYPAL_BUTTON_ID" />
            <input 
              type="image" 
              src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" 
              border="0" 
              name="submit" 
              title="PayPal - The safer, easier way to pay online!" 
              alt="Donate with PayPal button"
              className="paypal-button"
            />
          </form>
          <div className="paypal-me-container">
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
