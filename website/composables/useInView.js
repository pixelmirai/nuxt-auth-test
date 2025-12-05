export function useInView(element, callback, threshold) {
  if(!process.client) return
  const defaultThreshold = threshold ?? 0;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= defaultThreshold
        ) {
          callback();
        }
      });
    },
    { threshold: defaultThreshold }
  );

  observer.observe(element);
}



export function useNotInView(element, callback, threshold) {
  if(!process.client) return
  const defaultThreshold = threshold ?? 1;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          !entry.isIntersecting &&
          entry.intersectionRatio < defaultThreshold
        ) {
          callback();
        }
      });
    },
    { threshold: defaultThreshold }
  );

  observer.observe(element);
}
