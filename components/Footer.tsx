import Image from "next/image";

export function Footer() {
  return (
    <footer className="text-center text-gray-500">
      <a
        href="https://jonathan.now"
        target="_blank"
        rel="noopener noreferrer"
        className="flex  items-center justify-center gap-2 p-2"
      >
        <Image src="/sig.png" alt="Jonathan" width={100} height={100} className="w-6 h-6" />
        <span className="sr-only">made by Jonathan Myers | Product Designer</span>
      </a>
    </footer>
  );
}
