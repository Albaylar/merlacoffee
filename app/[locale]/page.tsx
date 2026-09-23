import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Location from '@/components/Location';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Location />
      <Reviews />
      <Contact />
    </main>
  );
}
