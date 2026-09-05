import { FeaturedArticle } from "@/components/Home/Featuredarticle";
import HomeHero from "@/components/Home/Home-hero";
import { TrustBadges } from "@/components/Home/TrustBadges";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <TrustBadges/>
      <FeaturedArticle />
    </main>
  );
}