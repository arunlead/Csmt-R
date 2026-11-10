import HeroScrub from "@/components/sections/HeroScrub";
import World from "@/components/world/World";
import Members from "@/components/sections/Members";
import LegalNotice from "@/components/sections/LegalNotice";
import Mascot from "@/components/sections/Mascot";

export default function Home() {
  return (
    <main className="bg-[#09080b]">
      <HeroScrub />
      <World />
      <Members />
      <Mascot />
      <LegalNotice />
    </main>
  );
}