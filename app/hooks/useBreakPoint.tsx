import { useEffect, useState } from 'react';

export const useBreakpoint = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (width > 1024 && width <= 1773) return 'lg';
  if (width > 1773) return 'xl';
};
