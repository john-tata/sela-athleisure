import HeroCarousel from '@/sections/HeroCarousel';
import FeatureStrip from '@/sections/FeatureStrip';
import NewCollection from '@/sections/NewCollection';
import ShopByCategory from '@/sections/ShopByCategory';
import BestSellers from '@/sections/BestSellers';
import WhySela from '@/sections/WhySela';
import Lookbook from '@/sections/Lookbook';
import VideoSection from '@/sections/VideoSection';
import Testimonials from '@/sections/Testimonials';
import Newsletter from '@/sections/Newsletter';

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <FeatureStrip />
      <NewCollection />
      <ShopByCategory />
      <BestSellers />
      <WhySela />
      <Lookbook />
      <VideoSection />
      <Testimonials />
      <Newsletter />
    </main>
  );
}