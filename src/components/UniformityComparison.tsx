import { motion } from "framer-motion";
import { Home, Users } from "lucide-react";

export const UniformityComparison = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px] w-full">
      {/* Recessed Neighbor - Top */}
      <motion.div
        initial={{ opacity: 0, x: 0, y: 0, scale: 0.9, rotate: 0 }}
        whileInView={{ opacity: 0.8, x: 0, y: -145, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute w-64 h-[110px] rounded-[24px] border border-border bg-white p-5 shadow-sm z-0 flex items-center"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-slate/10 p-2.5 text-slate">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="type-utility font-bold tracking-widest text-slate uppercase">Neighbor A</p>
            <p className="type-body-lg-emph text-primary">$98/sqft</p>
          </div>
        </div>
      </motion.div>

      {/* Recessed Neighbor - Bottom */}
      <motion.div
        initial={{ opacity: 0, x: 0, y: 0, scale: 0.9, rotate: 0 }}
        whileInView={{ opacity: 0.8, x: 0, y: 145, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute w-64 h-[110px] rounded-[24px] border border-border bg-white p-5 shadow-sm z-0 flex items-center"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-slate/10 p-2.5 text-slate">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="type-utility font-bold tracking-widest text-slate uppercase">Neighbor B</p>
            <p className="type-body-lg-emph text-primary">$101/sqft</p>
          </div>
        </div>
      </motion.div>

      {/* PROMINENT CENTER CARD (User) */}
      <motion.div
        initial={{ opacity: 0, x: 0, y: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="relative z-10 w-72 rounded-[24px] border-2 border-destructive bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-8 ring-destructive/5"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-destructive/10 p-3 text-destructive">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="type-utility font-bold tracking-widest text-destructive uppercase">Your Home</p>
            <p className="type-h3 text-primary leading-tight">$167/sqft</p>
          </div>
        </div>
        <div className="mt-5 rounded-lg bg-destructive/5 px-3 py-2 type-body-sm font-bold !text-destructive text-center">
          65% higher than neighbors
        </div>
      </motion.div>
    </div>
  );
};
