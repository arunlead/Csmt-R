import HeroScrub from "@/components/sections/HeroScrub";
import World from "@/components/world/World";
import Members from "@/components/sections/Members";
import LegalNotice from "@/components/sections/LegalNotice";

export default function Home() {
  return (
    <main className="bg-[#09080b]">
      <HeroScrub />
      <World />
      <Members />
      <LegalNotice />
    </main>
  );
}