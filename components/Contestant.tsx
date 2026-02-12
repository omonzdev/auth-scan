"use client";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { StarIcon } from "@heroicons/react/24/solid";
import { FaTooth } from "react-icons/fa";
import { SiCodechef } from "react-icons/si";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import Image from "next/image";
import type { Contestant, Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

interface ContestantProps {
  contestants: Contestant[];
  categories: Category[];
}

// Icon mapping for categories
const categoryIconMap: Record<
  string,
  { icon: React.ReactElement; show: string }
> = {
  dentist: {
    icon: <FaTooth className="w-6 h-6 text-blue-500" />,
    show: "Smile Masters",
  },
  chef: {
    icon: <SiCodechef className="w-6 h-6 text-orange-500" />,
    show: "Food Network Star",
  },
  ambassador: {
    icon: <StarIcon className="w-6 h-6 text-yellow-500" />,
    show: "Global Influencers",
  },
};

const Contestant = ({ contestants, categories }: ContestantProps) => {
  return (
    <div className="w-full bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-12 animate-fade-in">
          Meet Our Contestants
        </h2>

        {/* Category Sections */}
        {categories.map((category) => {
          const categoryContestants = contestants.filter((c) =>
            c.category?.some((cat) => cat._ref === category._id),
          );

          // Get icon and show info based on category slug or title
          const categoryKey =
            category.slug?.current || category.title?.toLowerCase() || "";
          const categoryMeta = categoryIconMap[categoryKey] || {
            icon: <StarIcon className="w-6 h-6 text-gray-500" />,
            show: "Competition",
          };

          return (
            <section key={category._id} id={category._id} className="mb-16">
              <div className="flex items-center justify-center mb-8">
                {categoryMeta.icon}
                <div className="ml-3">
                  <h3 className="text-2xl font-bold">
                    {category.title || "Category"}
                  </h3>
                  <p className="text-gray-400 text-sm">{categoryMeta.show}</p>
                </div>
              </div>
              {categoryContestants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryContestants.map((contestant, index) => {
                    // Get image URL from Sanity
                    const imageUrl = contestant.mainImage
                      ? urlFor(contestant.mainImage)
                          .width(250)
                          .height(250)
                          .url()
                      : "";

                    return (
                      <AlertDialog key={contestant._id}>
                        <div className="relative group bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                          <Image
                            src={imageUrl}
                            alt={
                              contestant.mainImage?.alt ||
                              contestant.name ||
                              "Contestant"
                            }
                            width={250}
                            height={250}
                            className="w-full h-64 object-cover transition-opacity duration-300 group-hover:opacity-90"
                            loading="lazy"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "/images/contestant-4.jpeg")
                            }
                          />
                          <div className="p-4 text-center">
                            <h4 className="text-xl font-semibold">
                              {contestant.name || "Unknown"}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {categoryMeta.show} #{index + 1}
                            </p>
                            <AlertDialogTrigger className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                              Vote Now
                            </AlertDialogTrigger>
                          </div>
                        </div>
                        <AlertDialogContent className="bg-gray-800 text-white rounded-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl">
                              Vote for {contestant.name}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex space-x-6 justify-center items-center py-4">
                              <Link
                                href="/home-support/instagram"
                                className="text-5xl text-red-400 hover:text-red-500 transition-colors"
                                aria-label={`Vote for ${contestant.name} on Instagram`}
                              >
                                <FaInstagram />
                              </Link>
                              <Link
                                href="/home-support/facebook"
                                className="text-5xl text-blue-400 hover:text-blue-500 transition-colors"
                                aria-label={`Vote for ${contestant.name} on Facebook`}
                              >
                                <FaFacebook />
                              </Link>
                              <Link
                                href="/home-support/mailer"
                                className="text-6xl text-[#54daff] hover:text-[#249ee4] transition-colors"
                                aria-label={`Vote for ${contestant.name} on Outlook`}
                              >
                                <PiMicrosoftOutlookLogoFill />
                              </Link>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                              Cancel
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  No contestants in this category yet.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Contestant;
