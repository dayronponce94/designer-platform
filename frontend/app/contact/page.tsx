import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactMap from '@/components/contact/ContactMap';

export default function ContactPage() {
    return (
        <div className="overflow-hidden">
            <ContactHero />
            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-12">
                        <ContactForm />
                        <ContactInfo />
                    </div>
                    <div>
                        <ContactMap />
                    </div>
                </div>
            </div>
        </div>
    );
}