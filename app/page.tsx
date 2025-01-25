import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import FadeUp from "@/components/FadeUp";
import LandingPageElements from "@/components/LandingPageElements";

export default function Home() {
  return (
    <div className="flex flex-col relative min-h-screen bg-gray-100">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <FadeUp>
              <Image
                src="/landing-page/hero-image.png"
                alt="Drawww Time"
                width={500}
                height={500}
                className="max-w-xs lg:max-w-xl w-full mx-auto"
              />
              <div className="space-y-4">
                <h1 className="sr-only">A simple drawing app for the web</h1>
                
              </div>
            </FadeUp>
            
            <FadeUp delay={0.1}>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                A simple drawing app for the web
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/draw">
                  <Button size="lg" className="  gap-2 py-8 px-12 bg-purple-700 hover:bg-purple-800 hover:shadow-lg rounded-full hover:scale-105 transition-all duration-150">
                    <Image src="/landing-page/start-drawing.svg" alt="Start Drawing" width={200} height={200} />
                  </Button>
                </Link>
              </div>
            </FadeUp>
          </div>

            <LandingPageElements />

        </div>

        

        {/* Features Section */}
        <div className=" features-section py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 px-8 gap-16 items-center lg:gap-48 max-w-7xl mx-auto">
              <FadeUp delay={0.2}>
                <div className="text-center space-y-4">

                    <Image src="/landing-page/just-draw-illustration.svg" alt="Just Draw" width={550} height={126} className="mx-auto " />

                  <div className="space-y-4">
                    <h3 className="sr-only">Just Draw</h3>
                    <Image 
                      src="/landing-page/just-draw.svg"
                      alt="Just Draw"
                      width={550}
                      height={126}
                      className="mx-auto"
                    />
                    <p className="text-gray-600">
                      One brush, one eraser, all the colors
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="text-center space-y-4">
                <Image src="/landing-page/janky-lines-illustration.svg" alt="Janky Lines" width={550} height={126} className="mx-auto" />
                  <div className="space-y-4">
                    <h3 className="sr-only">Janky Lines</h3>
                    <Image 
                      src="/landing-page/janky-lines.svg"
                      alt="Janky Lines"
                      width={550}
                      height={107}
                      className="mx-auto"
                    />
                    <p className="text-gray-600">
                      Embrace the charm of the 2000s
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.5}>
                <div className="text-center space-y-4">
                  <Image src="/landing-page/easy-export-illustration.svg" alt="Easy Export" width={550} height={126} className="mx-auto" />
                  <div className="space-y-4">
                    <h3 className="sr-only">Easy Export</h3>
                    <Image 
                      src="/landing-page/easy-export.svg"
                      alt="Easy Export"
                      width={550}
                      height={93}
                      className="mx-auto"
                    />
                    <p className="text-gray-600">
                      Download and share your drawings
                    </p>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
