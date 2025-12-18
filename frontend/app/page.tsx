import ModernHero from '@/components/home/ModernHero';
import ServicesShowcase from '@/components/home/ServicesShowcase';
import ProcessSection from '@/components/home/ProcessSection';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <ModernHero />
      <ServicesShowcase />
      <ProcessSection />
      <Testimonials />
      <CTASection />
    </div>
  );
}