export function useScrollHandler() {
  let scrollTimeout;
  let scrollStarted = false;
  let listener = null;

  const handleScroll = (options) => {
    if (!options) return;
    const { onStart, onStop, delay } = options;

    if (scrollStarted) {
      clearTimeout(scrollTimeout);
    } else if (onStart) {
      onStart();
      scrollStarted = true;
    }

    const d = delay ?? 100; // Default delay changed to 100ms for debounce effect

    scrollTimeout = setTimeout(() => {
      scrollStarted = false;
      if (onStop) onStop();
    }, d);
  };

  const create = (options) => {
    if (typeof window !== 'undefined') {
      listener = () => handleScroll(options);
      window.addEventListener("scroll", listener);
    }
  };

  const remove = () => {
    if (listener && typeof window !== 'undefined') {
      window.removeEventListener("scroll", listener);
      listener = null;
    }
  };

  return {
    handleScroll,
    create,
    remove,
  };
}