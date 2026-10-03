import { About } from "@/components/About";
import { Header, Hud } from "@/components/Chrome";
import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";
import { SiteRuntime } from "@/components/SiteRuntime";
import { Skills } from "@/components/Skills";
import { Stage } from "@/components/Stage";
import { Timeline } from "@/components/Timeline";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Stage />
      <Preloader />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Timeline />
        <Contact />
      </main>
      <Hud />
      <Cursor />
      <SiteRuntime />
    </>
  );
}
