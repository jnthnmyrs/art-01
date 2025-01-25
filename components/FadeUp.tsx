"use client";

import { motion, useInView  } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function FadeUp({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
    }
  }, [isInView]);


  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  }
  
  return (<>
    <motion.div
        ref={ref}
        variants={variants}   
        initial="hidden" 
        animate={isVisible ? "visible" : "hidden"} 
        transition={{ delay }}>
            {children}

    </motion.div>
  </>
  );
}
