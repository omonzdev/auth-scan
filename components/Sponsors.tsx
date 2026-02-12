"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

const Sponsors = () => {
  const aboutText = `
    The Online Ambassadors Program, held in the UAE & UK, is back! After successfully showcasing previous winners, we're excited to engage new talent. If you're 18 or older and passionate about culinary arts, dentistry, dancing, or fashion, this is your chance to shine. Prizes will be awarded at the end of the show based on votes for each contestant. Join us and let your talent take center stage!
  `;

  const sponsors = [
    {
      src: "/images/sponsor-1.jpeg",
      alt: "Food Network Sponsor",
      category: "Food Network",
      link: "#chef",
    },
    {
      src: "/images/sponsor-2.jpeg",
      alt: "Dentist Sponsor",
      category: "Dentist",
      link: "#dentist",
    },
    {
      src: "/images/sponsor-3.jpeg",
      alt: "Brand Ambassador Sponsor",
      category: "Brand Ambassador",
      link: "#ambassador",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* About Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <StarIcon
              className="w-12 h-12 text-yellow-400 animate-pulse"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in">
            About Our Program
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed animate-fade-in">
            {aboutText}
          </p>
        </div>

        {/* Sponsors Section */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 animate-fade-in">
            Our Sponsors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {sponsors.map((sponsor, index) => (
              <Link
                href={sponsor.link}
                key={index}
                className="relative group overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                aria-label={`View ${sponsor.category} contestants`}
              >
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  width={200}
                  height={100}
                  className="object-fit w-full h-40 rounded-full transition-opacity duration-300 "
                  loading="lazy"
                />
                <div className="absolute inset-0 duration-300 flex items-end">
                  <div className="p-3 text-center w-full">
                    <p className="text-white font-medium text-sm">
                      {sponsor.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// CSS for slide-in animation
const styles = `
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Sponsors;
