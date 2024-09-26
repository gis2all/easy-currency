export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

export const slideIn = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export const fadeInUp = (index) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.1 * index, duration: 0.3 },
});
