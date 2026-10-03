import { motion } from 'framer-motion';
export function AnimationDemo() { return <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>Framer Motion is ready.</motion.p>; }
