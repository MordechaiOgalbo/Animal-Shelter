import React from "react";
import "./Volunteer.css";
import { IoPaw } from "react-icons/io5";
import { PiBirdFill } from "react-icons/pi";
import { FaCat } from "react-icons/fa";
import { FaDog } from "react-icons/fa";
import { GiSquirrel } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";

const Volunteer = () => {
  return (
    <section className="volunteer-page">
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
      <FaHeart className="floating-icon heart-1" />

      {/* Page Title */}
      <h2 className="volunteer-title">Volunteer With Us</h2>

      {/* Intro */}
      <p className="volunteer-intro">
        Join the <strong>Noah's Ark</strong> family and make a real difference in the lives of animals. 
        Our volunteers are the heart of our organization, providing care, love, and support to animals 
        in need. Whether you have a few hours a week or want to help with special events, your time 
        and dedication are invaluable.
      </p>

      {/* Why Volunteer */}
      <div className="volunteer-section">
        <h3 className="section-title">
          Why Volunteer?
          <span className="heart-heading">
            <FaHeart />
          </span>
        </h3>
        <ul className="volunteer-list">
          <li>Make a meaningful impact on animals' lives</li>
          <li>Gain hands-on experience with animal care</li>
          <li>Join a compassionate community of animal lovers</li>
          <li>Learn about animal behavior and welfare</li>
          <li>Help animals find their forever homes</li>
          <li>Be part of a mission that saves lives</li>
        </ul>
      </div>

      {/* Volunteer Opportunities */}
      <div className="volunteer-section">
        <h3 className="section-title">
          Volunteer Opportunities
          <span className="paw-heading">
            <IoPaw />
          </span>
        </h3>
        <div className="opportunity-item">
          <h4 className="opportunity-title">Animal Care</h4>
          <p className="section-text">
            Help with feeding, grooming, walking, and socializing our animals. Perfect for those who 
            want direct interaction with our furry, feathered, and scaled friends.
          </p>
        </div>
        <div className="opportunity-item">
          <h4 className="opportunity-title">Shelter Maintenance</h4>
          <p className="section-text">
            Keep our facilities clean and safe. Tasks include cleaning enclosures, organizing supplies, 
            and maintaining our facilities to ensure a healthy environment for all animals.
          </p>
        </div>
        <div className="opportunity-item">
          <h4 className="opportunity-title">Adoption Support</h4>
          <p className="section-text">
            Assist with adoption events, help potential adopters find their perfect match, and provide 
            information about our animals and adoption process.
          </p>
        </div>
        <div className="opportunity-item">
          <h4 className="opportunity-title">Administrative Help</h4>
          <p className="section-text">
            Support our operations with data entry, phone calls, organizing paperwork, and helping with 
            communications and social media.
          </p>
        </div>
        <div className="opportunity-item">
          <h4 className="opportunity-title">Special Events</h4>
          <p className="section-text">
            Help organize and run fundraising events, adoption fairs, and community outreach programs. 
            Great for those who prefer flexible scheduling.
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="volunteer-section">
        <h3 className="section-title">
          Volunteer Requirements
          <span className="bird-heading">
            <PiBirdFill />
          </span>
        </h3>
        <ul className="volunteer-list">
          <li>Must be 16 years or older (with parental consent for minors)</li>
          <li>Commitment to at least 4 hours per month</li>
          <li>Compassion and patience for animals</li>
          <li>Ability to follow safety protocols and instructions</li>
          <li>Complete a brief orientation session</li>
          <li>Background check may be required for certain positions</li>
        </ul>
      </div>

      {/* How to Get Started */}
      <div className="volunteer-section">
        <h3 className="section-title">
          How to Get Started
          <span className="paw-heading">
            <IoPaw />
          </span>
        </h3>
        <ol className="volunteer-list numbered">
          <li>Fill out our volunteer application form</li>
          <li>Attend an orientation session to learn about our organization</li>
          <li>Meet with our volunteer coordinator to discuss your interests and availability</li>
          <li>Complete any required training for your chosen volunteer role</li>
          <li>Start making a difference in animals' lives!</li>
        </ol>
      </div>

      {/* Contact */}
      <div className="volunteer-section">
        <h3 className="section-title">
          Ready to Volunteer?
          <span className="heart-heading">
            <FaHeart />
          </span>
        </h3>
        <p className="section-text">
          We'd love to have you join our team! For more information about volunteering opportunities, 
          please contact us or visit our shelter. Together, we can make a difference in the lives 
          of animals who need our help.
        </p>
        <p className="section-text">
          <strong>Contact our Volunteer Coordinator:</strong><br />
          Email: volunteer@noahsark.org<br />
          Phone: (02) 123-4567<br />
          Or visit us at the shelter during business hours.
        </p>
      </div>
    </section>
  );
};

export default Volunteer;
