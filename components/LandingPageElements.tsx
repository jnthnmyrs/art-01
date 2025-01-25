import Image from "next/image";


export default function LandingPageElements() {
  return (

    <div className=" absolute hidden lg:block top-0 left-0 w-full h-full pointer-events-none">
        <Image
          src="/landing-page/element-03.svg"
          alt="decorative element"
          width={100}
          height={100}
          className="absolute bottom-[10%] left-[5%] w-16 md:w-24 lg:w-32 "
        />
    
      
        <Image
          src="/landing-page/element-04.svg"
          alt="decorative element"
          width={100}
          height={100}
          className="absolute bottom-[10%] right-[8%] w-20 md:w-28 lg:w-36 "
        />
      
      {/* ----- */}
      {/* ----- */}
      {/* ----- */}

        <Image
          src="/landing-page/element-06.svg"
          alt="decorative element"
          width={100}
          height={100}
          className="absolute top-[15%] left-[10%] w-16 md:w-24 lg:w-32 "
        />

        <Image
          src="/landing-page/element-07.svg"
          alt="decorative element"
          width={100}
          height={100}
          className="absolute top-[15%] right-[10%] w-16 md:w-24 lg:w-32 "
        />
    </div>

  );
}
