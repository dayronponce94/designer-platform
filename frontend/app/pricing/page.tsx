import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
//import PricingFAQ from '@/components/pricing/PricingFAQ';
//import PricingCTASection from '@/components/pricing/PricingCTASection';

export default function PricingPage() {
    return (
        <div className="overflow-hidden">
            <PricingHero />
            <PricingPlans />
            {/*<PricingFAQ />*/}
            {/*<PricingCTASection />*/}
        </div>
    );
}