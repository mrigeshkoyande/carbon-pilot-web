import React from "react";
import { motion } from "framer-motion";

interface AntiGravityWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const AntiGravityWrapper: React.FC<AntiGravityWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -12],
        rotate: [-1, 1],
      }}
      transition={{
        y: {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        },
        rotate: {
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        },
      }}
      whileHover={{
        scale: 1.03,
        y: -4,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
};

export default AntiGravityWrapper;
