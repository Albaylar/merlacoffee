import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Location from '@/components/Location';
import Reviews from '@/components/Reviews';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Location />
      <Reviews />
    </main>
  );
}
