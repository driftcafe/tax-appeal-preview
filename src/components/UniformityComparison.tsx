import { motion } from "framer-motion";
import { Home, Users } from "lucide-react";

export const UniformityComparison = () => {
  return (
    <div className="relative flex h-[400px] w-full items-center justify-center">
      {/* Background Card 2 */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 20, rotate: 5 }}
        whileInView={{ opacity: 1, x: 80, y: 50, rotate: 12 }}
        viewport={{ once: true }}
        className="absolute w-64 rounded-2xl border border-success/30 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-success/10 p-2 text-success">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[14px] font-bold tracking-wider text-[#6E6E73]">Neighbor B</p>
            <p className="text-lg font-bold text-[#1D1D1F]">$98/sqft</p>
          </div>
        </div>
      </motion.div>

      {/* Background Card 1 */}
      <motion.div
        initial={{ opacity: 0, x: 10, y: 10, rotate: 2 }}
        whileInView={{ opacity: 1, x: 40, y: 25, rotate: 6 }}
        viewport={{ once: true }}
        className="absolute w-64 rounded-2xl border border-success/50 bg-white p-5 shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-success/10 p-2 text-success">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[14px] font-bold tracking-wider text-[#6E6E73]">Neighbor A</p>
            <p className="text-lg font-bold text-[#1D1D1F]">$101/sqft</p>
          </div>
        </div>
      </motion.div>

      {/* Foreground Card (User) */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="relative z-10 w-72 rounded-[24px] border-2 border-destructive/80 bg-white p-6 shadow-2xl ring-8 ring-destructive/5"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-destructive/10 p-3 text-destructive">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[14px] font-bold tracking-widest text-destructive uppercase">Your Home</p>
            <p className="text-[28px] font-black text-[#1D1D1F] leading-tight">$167/sqft</p>
          </div>
        </div>
        <div className="mt-5 rounded-lg bg-destructive/5 px-3 py-2 text-sm font-bold text-destructive text-center">
          65% higher than neighbors
        </div>
      </motion.div>
    </div>
  );
};
