import React from "react";
import "./AboutUs.css";
import { IoPaw } from "react-icons/io5";
import { PiBirdFill } from "react-icons/pi";
import { FaCat } from "react-icons/fa";
import { FaFrog } from "react-icons/fa6";
import { FaDog } from "react-icons/fa";
import { GiSquirrel } from "react-icons/gi";

const AboutUs = () => {
  return (
    <section className="about-page">
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
      <FaFrog className="floating-icon frog-1" />

      {/* Page Title */}
      <h2 className="about-title">About Us</h2>

      {/* Intro */}
      <p className="about-intro">
        <strong>Noah’s Ark</strong> is an animal rescue and care organization
        based in Israel. Our mission is simple: to provide safety, kindness, and
        a second chance to every animal who needs it! Whether a pet was
        abandoned, mistreated, or temporarily without a home, we’re here to
        help.
      </p>

      {/* What We Do */}
      <div className="about-section">
        <h3 className="section-title">
          What We Do
          <span className="bird-heading">
            <PiBirdFill />
          </span>
        </h3>
        <ul className="about-list">
          <li>Rescue animals from the streets and unsafe environments.</li>
          <li>
            Provide shelter and care for animals from abusive or neglectful
            homes.
          </li>
          <li>
            Offer temporary housing when owners are unable to care for their
            pets (such as college, travel, military service, hospitalization, or
            emergencies!).
          </li>
          <li>Match animals with loving, stable permanent homes.</li>
          <li>
            Give every animal medical care, emotional support, and proper
            rehabilitation.
          </li>
        </ul>
      </div>

      {/* Problem We Solve */}
      <div className="about-section">
        <h3 className="section-title">What Problem We Solve</h3>
        <p className="section-text">
          Across Israel, many animals face abandonment, mistreatment, or
          situations where their owners can no longer care for them. Noah’s Ark
          provides a reliable, compassionate alternative — a safe place where
          every animal receives patience, respect, and proper care!
        </p>
      </div>

      {/* Our Team */}
      <div className="about-section">
        <h3 className="section-title">Our Team</h3>
        <p className="section-text">
          Noah’s Ark is powered by a dedicated team of trained, professional,
          and experienced staff members! Every rescue, rehabilitation, and
          adoption process is handled with care, skill, and compassion, ensuring
          each animal receives the attention they need to heal and thrive.
        </p>
        <p className="section-text">
          While we sometimes collaborate with community members, all core
          responsibilities — including medical care, behavioral support, and
          long-term planning — are carried out by our qualified team. This
          ensures safe, consistent, and dependable care for every animal at our
          shelter.
        </p>
      </div>

      {/* What Makes Us Different */}
      <div className="about-section">
        <h3 className="section-title">What Makes Us Different</h3>
        <ul className="about-list">
          <li>We support both long-term and temporary adoption needs.</li>
          <li>
            We take in animals from difficult, urgent, and unsafe situations.
          </li>
          <li>We focus on emotional healing, not just physical recovery!</li>
          <li>
            We carefully match pets with homes based on lifestyle and
            compatibility.
          </li>
          <li>We provide personalized care plans for each rescued animal.</li>
        </ul>
      </div>

      {/* Our Story */}
      <div className="about-section">
        <h3 className="section-title">Our Story</h3>
        <p className="section-text">
          Noah’s Ark began with a small group of animal lovers who refused to
          ignore the rising number of pets left behind! What started as a small
          effort to help a few animals has grown into a full rescue shelter that
          now protects and cares for pets in need across Israel.
        </p>
        <p className="section-text">
          Our story is built on compassion, dedication, and the belief that
          every paw, wing, or whisker deserves a life filled with safety and
          love. That belief guides every decision we make and every life we
          save!
        </p>
      </div>

      {/* Join Us */}
      <div className="about-section">
        <h3 className="section-title">Join Us</h3>
        <p className="section-text">
          Whether you’re considering adoption, fostering, donating, or simply
          spreading awareness — your support helps give animals a better
          tomorrow! Together, we can make a real difference, one rescued life at
          a time.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
