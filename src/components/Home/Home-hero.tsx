import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[480px] overflow-hidden sm:h-[520px] lg:h-[560px]">
      
      {/* Complete generated banner image */}
      <Image
        src="/images/home-banner-image.png"
        alt="Masjid al-Haram in Makkah"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Left-side content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
          
          <div className="max-w-[560px]">
            
            <h1 className="font-serif text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[58px]">
              Guidance for
              <span className="block text-[#35B982]">
                Your Spiritual Journey
              </span>
            </h1>

            <div className="my-6 h-[2px] w-14 bg-[#D6A84F]" />

            <p className="max-w-[500px] text-base leading-7 text-white/90 sm:text-lg">
              Practical guides, tips and inspiring stories to help you
              prepare for Hajj and Umrah with confidence.
            </p>

            <Link
              href="/blog"
              className="mt-7 inline-flex items-center gap-3 rounded-md
                         bg-[#159B68] px-6 py-3.5
                         text-sm font-semibold text-white
                         transition-all duration-300
                         hover:bg-[#20AE78]"
            >
              Explore All Articles
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
}