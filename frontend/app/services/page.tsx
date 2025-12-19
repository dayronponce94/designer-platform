import ServicesHero from '@/components/services/ServicesHero';
import ServicesGrid from '@/components/services/ServicesGrid';
import ProcessWorkflow from '@/components/services/ProcessWorkflow';
//import WhyChooseUs from '@/components/services/WhyChooseUs';
//import CTAServices from '@/components/services/CTAServices';

export default function ServicesPage() {
    return (
        <div className="overflow-hidden">
            <ServicesHero />
            <ServicesGrid />
            <ProcessWorkflow />
            {/*<WhyChooseUs />*/}
            {/*<CTAServices />*/}
        </div>
    );
}