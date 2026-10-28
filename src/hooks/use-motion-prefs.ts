import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** True only after hydration on fine-pointer desktop screens with motion allowed. */
export function useRichMotion() {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return { rich: desktop && !reduced, reduced: !!reduced, desktop };
}
