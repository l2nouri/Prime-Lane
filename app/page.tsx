import Script from "next/script";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Problem from "@/components/home/Problem";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import AssessmentCTA from "@/components/home/AssessmentCTA";
import About from "@/components/home/About";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 64 }}>
        <Hero />
        <Problem />
        <Services />
        <HowItWorks />
        <AssessmentCTA />
        <About />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <Script src="/widget.js" strategy="afterInteractive" />
    </>
  );
}
