import Hero from "../../components/user/Hero";
import UserTypes from "../../components/user/UserTypes";
import UserLayout from "../../layouts/UserLayout";
import FeaturedProducts from "../../components/user/FeaturedProducts";

function Home() {
  return (
    <UserLayout>
      <Hero />
      <UserTypes />
      <FeaturedProducts />
    </UserLayout>
  );
}

export default Home;