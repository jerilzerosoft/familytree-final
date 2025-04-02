import Image from "next/image";
import Link from "next/link";
import Welcome from "@/assets/images/welcome.png";
import HandIcon from "@/assets/images/hand-icon.png";
import Gallery from "@/assets/images/gallery.png";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

const FamilyMembers = () => {
  const features = [
    {
      id: 1,
      title: "Track Your Family History",
      description:
        "Effortlessly map out your ancestry and discover hidden connections.",
      icon: HandIcon,
    },
    {
      id: 2,
      title: "Preserve Memories",
      description:
        "Store photos, stories, and life events in a secure digital space.",
      icon: HandIcon,
    },
    {
      id: 3,
      title: "Strengthen Family Bonds",
      description:
        "Stay connected with loved ones and celebrate your shared heritage.",
      icon: HandIcon,
    },
    {
      id: 4,
      title: "Easy to Use & Secure",
      description:
        "Our intuitive interface makes building your family tree simple, safe, and private.",
      icon: HandIcon,
    },
  ];

  const gallery = [
    {
      id: 1,
      title: "Upload & Organize Photos",
      description: "Store and categorize family pictures effortlessly.",
      icon: HandIcon,
    },
    {
      id: 2,
      title: "Share Videos & Stories",
      description:
        "Add videos and personal anecdotes to bring memories to life.",
      icon: HandIcon,
    },
    {
      id: 3,
      title: "Create Family Albums",
      description: "Curate and customize albums for special occasions.",
      icon: HandIcon,
    },
    {
      id: 4,
      title: "Search & Discover",
      description: "Easily find old memories with advanced search filters.",
      icon: HandIcon,
    },
  ];

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="text-white text-center inner-banner">
        <Header />
        <div className="flex justify-center items-center">
            <h1 className="text-2xl md:text-5xl font-bold shadow-md">
              FAMILY MEMBERS
            </h1>
        </div>
      </div>

      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-3xl font-semibold text-green-700 text-center mb-12">
          About the Family Tree
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold mb-4">
              Preserve Your Family's Legacy for Generations to Come.
            </h3>
            <p className="text-gray-700 mb-8">
              Every family has a story worth telling. With our Family Tree
              platform, you can bring your family's history to life—track
              generations, celebrate bonds, and ensure your legacy lives on for
              the future.
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start p-4 bg-gradient-to-r from-[#F0ED5C] to-[#FFFFFF] rounded-md"
                >
                  <div className="mr-3 p-2 rounded-full">
                    <Image
                      src={feature.icon}
                      alt="Family gathering at ancestral house"
                      width={22}
                      height={19}
                      className="rounded-lg"
                    />
                    <span role="img" aria-label="icon"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-700">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/family-members"
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                View Family Tree
              </Link>
            </div>
          </div>

          <div>
            <Image src={Welcome} alt="Family gathering at ancestral house" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-green-700 text-center mb-12">
          Explore Family Gallery
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image src={Gallery} alt="Family gathering at ancestral house" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">
              Explore Your Family’s Timeless Moments.
            </h3>
            <p className="text-gray-700 mb-8">
              Every photograph tells a story, every memory holds a legacy. The
              Family Gallery is a place where you can store, explore, and share
              your family's precious moments. From childhood snapshots to grand
              celebrations, keep your memories alive for generations to come.
            </p>

            <div className="space-y-4">
              {gallery.map((g) => (
                <div
                  key={g.id}
                  className="flex items-start p-4 bg-gradient-to-r from-[#F0ED5C] to-[#FFFFFF] rounded-md"
                >
                  <div className="mr-3 p-2 rounded-full">
                    <Image
                      src={g.icon}
                      alt="Family gathering at ancestral house"
                      width={22}
                      height={19}
                      className="rounded-lg"
                    />
                    <span role="img" aria-label="icon"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{g.title}</h4>
                    <p className="text-sm text-gray-700">{g.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/family-members"
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FamilyMembers;
