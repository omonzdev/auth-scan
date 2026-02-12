import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Sponsors from "@/components/Sponsors";
import Contestant from "@/components/Contestant";
import { getAllContestants } from "@/sanity/lib/contestant/getAllContestant";
import { getAllCategories } from "@/sanity/lib/category/getAllCategories";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const contestants = await getAllContestants();
  const categories = await getAllCategories();
  if (contestants.length > 0) console.log(contestants);
  return (
    <main>
      <Navbar />
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <Sponsors />
      </section>
      <section id="vote">
        <Contestant contestants={contestants} categories={categories} />
      </section>
      <Footer />
    </main>
  );
}
