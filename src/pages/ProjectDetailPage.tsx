import React from "react";
import { useParams } from "react-router-dom";
import ProjectDetails from "../components/Projects/ProjectDetails";

const publicUrl = import.meta.env.BASE_URL;

// Project data for different projects
const projectsData = {
  "luxury-villa-brighton": {
    id: "luxury-villa-brighton",
    title: "Luxury Villa in Brighton",
    subtitle: "Oceanfront Luxury Living",
    description:
      "This stunning modern villa in Brighton features panoramic ocean views, contemporary architecture, and premium finishes throughout. The design seamlessly blends indoor and outdoor living spaces, creating a luxurious retreat that captures the essence of coastal living.",
    heroImage: `${publicUrl}images/l1.jpg`,
    features: [
      {
        title: "Infinity Pool & Ocean Views",
        description:
          "Expansive infinity pool overlooking the ocean with integrated spa features and outdoor entertainment areas.",
        image: `${publicUrl}images/sm1.jpg`,
      },
      {
        title: "Open-Plan Living",
        description:
          "Spacious open-plan design connecting the living, dining, and kitchen areas with floor-to-ceiling glass windows.",
        image: `${publicUrl}images/sm2.jpg`,
      },
      {
        title: "Smart Home Technology",
        description:
          "Integrated smart home systems for lighting, climate control, security, and entertainment throughout the property.",
        image: `${publicUrl}images/sm3.jpg`,
      },
    ],
    process: [
      {
        step: 1,
        title: "Site Analysis & Design",
        description:
          "Comprehensive site evaluation considering ocean views, coastal regulations, and environmental impact assessments.",
        image: `${publicUrl}images/sm4.jpg`,
      },
      {
        step: 2,
        title: "Construction Planning",
        description:
          "Detailed construction planning with local contractors, material sourcing, and timeline development.",
        image: `${publicUrl}images/sm5.jpg`,
      },
      {
        step: 3,
        title: "Quality Assurance",
        description:
          "Rigorous quality control throughout construction with regular inspections and final walkthrough before handover.",
        image: `${publicUrl}images/sm1.jpg`,
      },
    ],
    testimonial: {
      quote:
        "Our Brighton villa exceeded all expectations. The ocean views are breathtaking, and the modern design perfectly complements the coastal location. FORMA delivered a masterpiece.",
      author: "Sarah & Michael Chen",
      project: "Luxury Villa, Brighton",
    },
    gallery: [
      `${publicUrl}images/l2.jpg`,
      `${publicUrl}images/l3.jpg`,
      `${publicUrl}images/l4.jpg`,
      `${publicUrl}images/l5.jpg`,
    ],
    ctaTitle: "Experience Luxury Living",
    ctaDescription:
      "Discover how we can create your dream coastal retreat. Contact us to discuss your luxury villa project.",
  },
  "contemporary-family-home": {
    id: "contemporary-family-home",
    title: "Contemporary Family Home",
    subtitle: "Modern Family Living Space",
    description:
      "This contemporary family home combines sleek modern design with practical family living. Featuring an open-plan layout, sustainable materials, and smart home integration, it provides the perfect environment for modern family life.",
    heroImage: `${publicUrl}images/l2.jpg`,
    features: [
      {
        title: "Open-Plan Layout",
        description:
          "Seamless flow between living spaces with high ceilings and abundant natural light.",
        image: `${publicUrl}images/sm2.jpg`,
      },
      {
        title: "Sustainable Materials",
        description:
          "Eco-friendly construction using recycled materials and energy-efficient systems.",
        image: `${publicUrl}images/sm3.jpg`,
      },
      {
        title: "Family-Oriented Design",
        description:
          "Thoughtful design elements including play areas, home office spaces, and flexible room configurations.",
        image: `${publicUrl}images/sm4.jpg`,
      },
    ],
    process: [
      {
        step: 1,
        title: "Family Consultation",
        description:
          "Understanding family dynamics, lifestyle needs, and long-term requirements for the home design.",
        image: `${publicUrl}images/sm1.jpg`,
      },
      {
        step: 2,
        title: "Design & Planning",
        description:
          "Creating detailed plans that balance modern aesthetics with practical family functionality.",
        image: `${publicUrl}images/sm2.jpg`,
      },
      {
        step: 3,
        title: "Construction & Finishing",
        description:
          "Building with quality materials and attention to detail for a durable, beautiful family home.",
        image: `${publicUrl}images/sm3.jpg`,
      },
    ],
    testimonial: {
      quote:
        "Our contemporary family home is everything we dreamed of and more. The open spaces work perfectly for our growing family, and the sustainable features give us peace of mind.",
      author: "Jennifer & David Chen",
      project: "Contemporary Family Home, Brighton",
    },
    gallery: [
      `${publicUrl}images/l3.jpg`,
      `${publicUrl}images/l4.jpg`,
      `${publicUrl}images/l5.jpg`,
      `${publicUrl}images/l1.jpg`,
    ],
    ctaTitle: "Build Your Family Home",
    ctaDescription:
      "Create the perfect family sanctuary with our contemporary home design expertise.",
  },
  "urban-penthouse-renovation": {
    id: "urban-penthouse-renovation",
    title: "Urban Penthouse Renovation",
    subtitle: "City Living Redefined",
    description:
      "Complete transformation of a city penthouse into a luxurious urban oasis. This renovation project combined modern design with premium finishes, creating a sophisticated space that maximizes city views and lifestyle.",
    heroImage: `${publicUrl}images/l3.jpg`,
    features: [
      {
        title: "City Skyline Views",
        description:
          "Floor-to-ceiling windows and open terraces providing unobstructed views of the city skyline.",
        image: `${publicUrl}images/sm3.jpg`,
      },
      {
        title: "Premium Finishes",
        description:
          "Luxury materials including marble countertops, custom cabinetry, and high-end appliances.",
        image: `${publicUrl}images/sm4.jpg`,
      },
      {
        title: "Smart Integration",
        description:
          "Seamless integration of technology for lighting, entertainment, and home automation systems.",
        image: `${publicUrl}images/sm5.jpg`,
      },
    ],
    process: [
      {
        step: 1,
        title: "Assessment & Vision",
        description:
          "Evaluating the existing space and developing a vision that maximizes the penthouse's potential.",
        image: `${publicUrl}images/sm2.jpg`,
      },
      {
        step: 2,
        title: "Design Development",
        description:
          "Creating detailed renovation plans that respect the building's structure while introducing modern luxury.",
        image: `${publicUrl}images/sm3.jpg`,
      },
      {
        step: 3,
        title: "Renovation Execution",
        description:
          "Careful renovation work minimizing disruption while achieving the desired luxurious outcome.",
        image: `${publicUrl}images/sm4.jpg`,
      },
    ],
    testimonial: {
      quote:
        "The penthouse renovation transformed our space into a luxurious urban retreat. The attention to detail and quality of finishes exceeded our expectations.",
      author: "Emma & James Wilson",
      project: "Penthouse Renovation, South Yarra",
    },
    gallery: [
      `${publicUrl}images/l4.jpg`,
      `${publicUrl}images/l5.jpg`,
      `${publicUrl}images/l1.jpg`,
      `${publicUrl}images/l2.jpg`,
    ],
    ctaTitle: "Elevate Your Urban Living",
    ctaDescription:
      "Transform your city space into a luxurious penthouse sanctuary.",
  },
  "heritage-estate-restoration": {
    id: "heritage-estate-restoration",
    title: "Heritage Estate Restoration",
    subtitle: "Preserving History with Modern Luxury",
    description:
      "Careful restoration of a historic estate that preserves architectural heritage while introducing modern amenities and luxury. This project demonstrates our expertise in balancing tradition with contemporary comfort.",
    heroImage: `${publicUrl}images/l4.jpg`,
    features: [
      {
        title: "Heritage Preservation",
        description:
          "Maintaining original architectural features, period details, and historical integrity.",
        image: `${publicUrl}images/sm4.jpg`,
      },
      {
        title: "Modern Amenities",
        description:
          "Integration of contemporary systems including smart technology, modern kitchens, and luxury bathrooms.",
        image: `${publicUrl}images/sm5.jpg`,
      },
      {
        title: "Structural Integrity",
        description:
          "Reinforcement and modernization of structural elements while preserving the building's character.",
        image: `${publicUrl}images/sm1.jpg`,
      },
    ],
    process: [
      {
        step: 1,
        title: "Historical Research",
        description:
          "Comprehensive research into the estate's history, architecture, and heritage significance.",
        image: `${publicUrl}images/sm3.jpg`,
      },
      {
        step: 2,
        title: "Restoration Planning",
        description:
          "Developing detailed plans that respect heritage guidelines while introducing modern functionality.",
        image: `${publicUrl}images/sm4.jpg`,
      },
      {
        step: 3,
        title: "Careful Restoration",
        description:
          "Meticulous restoration work using traditional techniques combined with modern construction methods.",
        image: `${publicUrl}images/sm5.jpg`,
      },
    ],
    testimonial: {
      quote:
        "The restoration of our heritage estate was masterful. FORMA preserved the historical character while creating a modern, comfortable home for our family.",
      author: "Robert & Catherine Miller",
      project: "Custom Estate, Hawthorn",
    },
    gallery: [
      `${publicUrl}images/l5.jpg`,
      `${publicUrl}images/l1.jpg`,
      `${publicUrl}images/l2.jpg`,
      `${publicUrl}images/l3.jpg`,
    ],
    ctaTitle: "Restore Your Heritage",
    ctaDescription:
      "Preserve architectural history while enjoying modern luxury living.",
  },
  "eco-friendly-townhouse": {
    id: "eco-friendly-townhouse",
    title: "Eco-Friendly Townhouse",
    subtitle: "Sustainable Urban Living",
    description:
      "A forward-thinking townhouse design that incorporates green technologies and sustainable practices. This project showcases our commitment to environmentally responsible architecture without compromising on style or comfort.",
    heroImage: `${publicUrl}images/l5.jpg`,
    features: [
      {
        title: "Solar Power Integration",
        description:
          "Solar panels and energy storage systems providing clean, renewable energy for the home.",
        image: `${publicUrl}images/sm5.jpg`,
      },
      {
        title: "Green Building Materials",
        description:
          "Sustainable materials including recycled timber, low-VOC paints, and energy-efficient insulation.",
        image: `${publicUrl}images/sm1.jpg`,
      },
      {
        title: "Water Conservation",
        description:
          "Rainwater harvesting, greywater recycling, and water-efficient fixtures reducing environmental impact.",
        image: `${publicUrl}images/sm2.jpg`,
      },
    ],
    process: [
      {
        step: 1,
        title: "Sustainability Assessment",
        description:
          "Evaluating environmental impact and developing strategies for sustainable construction practices.",
        image: `${publicUrl}images/sm4.jpg`,
      },
      {
        step: 2,
        title: "Green Design",
        description:
          "Incorporating sustainable design principles while maintaining aesthetic appeal and functionality.",
        image: `${publicUrl}images/sm5.jpg`,
      },
      {
        step: 3,
        title: "Eco-Construction",
        description:
          "Building with environmentally responsible methods and materials for a truly sustainable home.",
        image: `${publicUrl}images/sm1.jpg`,
      },
    ],
    testimonial: {
      quote:
        "Our eco-friendly townhouse is not only beautiful but also environmentally responsible. The sustainable features give us confidence in our environmental impact.",
      author: "Andrew & Sarah Johnson",
      project: "Victorian Home Renovation, Prahran",
    },
    gallery: [
      `${publicUrl}images/l1.jpg`,
      `${publicUrl}images/l2.jpg`,
      `${publicUrl}images/l3.jpg`,
      `${publicUrl}images/l4.jpg`,
    ],
    ctaTitle: "Build Sustainably",
    ctaDescription:
      "Create an environmentally responsible home that contributes to a sustainable future.",
  },
};

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const projectData = projectId
    ? projectsData[projectId as keyof typeof projectsData]
    : projectsData["luxury-villa-brighton"];

  if (!projectData) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center" }}>
        <h1>Project Not Found</h1>
        <p>The requested project could not be found.</p>
      </div>
    );
  }

  const processImages = projectData.process?.map((p) => p.image) || [];
  const galleryImages = projectData.gallery || [];
  const fullImage = galleryImages[0] || projectData.heroImage;

  return (
    <ProjectDetails
      heroImage={projectData.heroImage}
      title={projectData.title}
      subtitle={projectData.subtitle}
      category={projectData.subtitle}
      backLink="/projects"
      fullImage={fullImage}
      processImages={processImages}
      galleryImages={galleryImages}
    />
  );
};

export default ProjectDetailPage;
