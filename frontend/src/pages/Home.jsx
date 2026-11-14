import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import StatisticsSection from '../components/StatisticsSection'
import LearningPaths from '../components/LearningPaths'
import CertificationSection from '../components/CertificationSection'
import PracticalLearning from '../components/PracticalLearning'
import FeatureGrid from '../components/FeatureGrid'
import PartnerSection from '../components/PartnerSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-action-600 focus:text-white focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <HeroSection />
        <StatisticsSection />
        <LearningPaths />
        <CertificationSection />
        <PracticalLearning />
        <FeatureGrid />
        <PartnerSection />
        <CTASection />
      </main>

      <Footer />
    </>
  )
}
