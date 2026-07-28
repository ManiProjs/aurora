import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function StartupScreen() {
  return (
    <div
      className="
    flex
    h-screen
    items-center
    justify-center
    bg-zinc-950
    text-white
  "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="
          flex
          items-center
          gap-5
        "
      >
        {/* Animated Aurora icon */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-gradient-to-br
            from-cyan-400
            via-purple-500
            to-pink-500
            shadow-2xl
          "
        >
          <Sparkles size={42} className="text-white" />
        </motion.div>

        <motion.h1
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.25,
            duration: 0.5,
          }}
          className="
            text-5xl
            font-bold
            tracking-tight
          "
        >
          Aurora
        </motion.h1>
      </motion.div>
    </div>
  );
}
