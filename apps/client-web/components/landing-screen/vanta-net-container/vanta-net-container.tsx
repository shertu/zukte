/* eslint-disable */

import * as ThreeJs from 'three';

// @ts-ignore
import NET from 'vanta/dist/vanta.net.min.js';
import React from 'react';

/**
 * A component which renders a Vanta NET 3D visual effect.
 */
export function VantaNetContainer(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
): JSX.Element {
  const [vantaEffect, setVantaEffect] = React.useState<any>(0);

  const vantaRef = React.useRef(null);

  React.useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: ThreeJs, // use a custom THREE when initializing
          color: 0xacacde,
          backgroundColor: 0xe5fcff,
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
