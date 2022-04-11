/* eslint-disable */

// @ts-ignore
import NET from 'vanta/dist/vanta.net.min.js';
import React from 'react';

export type VantaNetContainerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

/**
 * A component which renders a Vanta NET 3D visual effect.
 */
export function VantaNetContainer(props: VantaNetContainerProps) {
  const [vantaEffect, setVantaEffect] = React.useState<any>(0);
  const vantaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          color: 0xfe7a47,
          backgroundColor: 0xfcfdfe,
        })
      );
    }

    // clean-up on component unload
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // render
  return <div {...props} ref={vantaRef} />;
}
