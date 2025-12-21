import PortfolioHero from '@/components/portfolio/PortfolioHero';
import EducationExperience from '@/components/portfolio/EducationExperience';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ProjectsGallery from '@/components/portfolio/ProjectsGallery';

export default function PortfolioPage() {
    return (
        <div className="overflow-hidden">
            <PortfolioHero />
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <EducationExperience />
                    </div>
                    <div className="lg:col-span-1">
                        <SkillsSection />
                    </div>
                </div>
                <ProjectsGallery />
            </div>
        </div>
    );
}