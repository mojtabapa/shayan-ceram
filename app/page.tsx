import Header from "@/components/Header";
import PromoBar from "@/components/PromoBar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Features from "@/components/Features";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <PromoBar />
      <Hero />
      <Features />
      <FeaturedProducts />
      <About />
      <Contact />
      <Footer />
    </>
  );
}