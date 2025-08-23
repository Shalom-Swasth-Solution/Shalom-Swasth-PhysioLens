import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import ProgressChart from '../components/ProgressChart';
import CommunitySection from '../components/CommunitySection';
import RecentActivity from '../components/RecentActivity';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureCards />
        <ProgressChart />
        <CommunitySection />
        <RecentActivity />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;