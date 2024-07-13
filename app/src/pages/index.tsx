import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import BenefitsSection from '../components/BenefitsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CallToActionSection from '../components/CallToActionSection';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CallToActionSection />
      <ContactSection />
    </Layout>
  );
};

export default HomePage;
