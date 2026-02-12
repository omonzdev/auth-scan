import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-start text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/voting-bg.jpg"
          alt="Hero Background"
          width={1000}
          height={1000}
          className="w-full h-full object-cover object-right"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 text-start px-6 max-w-3xl md:pl-28">
        <Image
          src="/images/logo-mini.png"
          alt="Mini Logo"
          width={100}
          height={100}
          className="mb-6"
          loading="lazy"
        />
        <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4">
          Award of Recognition For Performance & Excellence
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Every vote counts! Stand with your contestant, celebrate their
          creativity, and honor Excellence. your support makes all the
          differcen! <span className="font-extrabold">VoteForExcellence</span>
        </p>
        <div className="flex justify-start space-x-4">
          <a
            href="#vote"
            className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
          >
            Vote Now
          </a>
          <a
            href="#about"
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
