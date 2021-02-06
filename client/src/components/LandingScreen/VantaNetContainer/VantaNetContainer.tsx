import * as ThreeJs from 'three';

import { useEffect, useRef, useState } from 'react';

// @ts-ignore
import NET from 'vanta/dist/vanta.net.min.js';
import React from 'react';

/**
 * A component which renders a Vanta NET 3D visual effect.
 *
 * @param {RowProps} props
 * @return {JSX.Element}
 */
export function VantaNetContainer(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
): JSX.Element {
  const [vantaEffect, setVantaEffect] = useState<any>(0);

  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: ThreeJs, // use a custom THREE when initializing
          color: 0xd8412f,
          backgroundColor: 0xfcfdfe,
        }),
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
