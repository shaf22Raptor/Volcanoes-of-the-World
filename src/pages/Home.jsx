import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}

// hero content for main page
const Hero = () => (
  <section className="hero">
    {/* content for the hero */}
    <div className="hero_content">
      <h1 className="hero_title">Volcanoes of the World</h1>
      <p className="hero_subtitle">A comprehensive encyclopedia of the world's volcanoes</p>
      <Link to="/volcanoes">Search Volcanoes</Link>
      <Link to="/loginRegister">Login / Register</Link>
    </div>
  </section>
);

// features section
function Features() {
  /* The information for our features in JSON
  so we can reduce the amount of repetitive JSX and reuse one component instead */
  const featuresData = [
    {
      heading: "Trustworthy & Reliable",
      text:
        "We fetch the latest data about the world's volcanoes. You won't be disappointed.",
      img: { src: "img/like.png", alt: "Thumbs up icon" }
    },
    {
      heading: "Privacy Guaranteed",
      text:
        "The data we collect from you to access exclusive content is minimal, and kept safe!",
      img: { src: "img/security.png", alt: "Secure lock icon" }
    },
    {
      heading: "Satisfaction guaranteed",
      text:
        "Not happy with our service? That's too bad!",
      img: { src: "img/heart.png", alt: "Heart icon" }
    }
  ];

  return (
    <article className="features">
      <div className="features_header">
        <h2>Our Promise</h2>
      </div>
      <div className="features_box-wrapper">
        {
          // display the information for each of our features in their own Box
          featuresData.map((feature) => (
            <FeatureBox feature={feature} />
          ))
        }
      </div>
    </article>
  );
}

// Display a Feature box when passed in the information for the feature
const FeatureBox = ({ feature }) => (
  <div className="features_box">
    <img src={feature.img.src} alt={feature.img.alt} />
    <h5>{feature.heading}</h5>
    <p>{feature.text}</p>
  </div>
);
