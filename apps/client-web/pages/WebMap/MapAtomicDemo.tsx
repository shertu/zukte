// import 'ol/ol.css';
// import './style.less';

// import { Control, defaults as defaultControls } from 'ol/control';
// import { OSM as OSMSource, Vector as VectorSource } from 'ol/source';
// import { Feature as OlFeature, Map as OlMap, View as OlView } from 'ol';
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

// import { AppPage } from '../../AppPage/AppPage';
// import { Coordinate } from 'ol/coordinate';
// import { Draw as DrawInteraction } from 'ol/interaction';
// import { Point as GeomPoint } from 'ol/geom';
// import GeometryType from 'ol/geom/GeometryType';
// import { PushpinOutlined } from '@ant-design/icons';
// import React from 'react';
// import { Style } from 'ol/style';
// import { Switch } from 'antd';
// import { fromLonLat } from 'ol/proj';
// import { mapPushpinIcon } from './MapPushpinIcon';

// const melbourneCoordinate: Coordinate =
//   fromLonLat([144.9631, -37.8136]);
// const pointFeatureMelbourne =
//   new OlFeature(new GeomPoint(melbourneCoordinate));
// const osmLayer: TileLayer =
//   new TileLayer({ source: new OSMSource() });

// /**
//  * A demonstration where the user can mark locations on a map.
//  */
// export function MapAtomicDemo(): JSX.Element {
//   const mapContainerRef = React.createRef<HTMLDivElement>();
//   const pushpinControlRef = React.createRef<HTMLDivElement>();

//   const [pushpinModeActive, setPushpinModeActive] =
//     React.useState<boolean>(false);

//   const [drawInteraction, setDrawInteraction] =
//     React.useState<DrawInteraction>(null);

//   const [map, setMap] =
//     React.useState<OlMap>(null);

//   const [pushpinLayerSource, setPushpinLayerSource] =
//     React.useState<VectorSource<GeomPoint>>(
//       new VectorSource({
//         features: [pointFeatureMelbourne],
//       }),
//     );

//   /** Sets up the initial values for the open layers map. */
//   React.useEffect(() => {
//     const mapTarget: HTMLElement = mapContainerRef.current;

//     const pushpinLayer: VectorLayer = new VectorLayer({
//       source: pushpinLayerSource,
//       style: new Style({
//         image: mapPushpinIcon,
//       }),
//     });

//     const pushpinControl: Control = new Control({
//       element: pushpinControlRef.current,
//     });

//     const mapView: OlView = new OlView({
//       center: melbourneCoordinate,
//       zoom: 3,
//     });

//     const newMapValue: OlMap = new OlMap({
//       target: mapTarget,
//       layers: [osmLayer, pushpinLayer],
//       view: mapView,
//       controls: defaultControls().extend([pushpinControl]),
//     });

//     setMap(newMapValue);
//   }, []);

//   /** Handles a change to the pushpin mode. */
//   React.useEffect(() => {
//     if (pushpinModeActive) {
//       const newDrawInteractionValue: DrawInteraction = new DrawInteraction({
//         source: pushpinLayerSource,
//         type: GeometryType.POINT,
//       });

//       map.addInteraction(newDrawInteractionValue);
//       setDrawInteraction(newDrawInteractionValue);
//     } else {
//       if (drawInteraction) {
//         map.removeInteraction(drawInteraction);
//       }
//     }
//   }, [pushpinModeActive]);

//   // /** */
//   // function addPointFeatureToPushpinSource(): void {
//   //  const longitude: number = chance.longitude();
//   //  const latitude: number = chance.latitude();
//   //  const coord: Coordinate = fromLonLat([longitude, latitude]);
//   //  const geomP: GeomPoint = new GeomPoint(coord);
//   //  const pointFeature: OlFeature<GeomPoint> =
//   // new OlFeature<GeomPoint>(geomP);

//   //  pushpinLayerSource.addFeature(pointFeature);
//   //  console.log('addPointFeatureToPushpinSource with coord: ', coord);
//   // }

//   /**
//    * Handles the change of state for the pushpin mode switch.
//    */
//   function onChangePushpinControl(
//     checked: boolean,
//     event: MouseEvent
//   ): void {
//     setPushpinModeActive(checked);
//   }

//   return (
//     <AppPage pageTitle="Map Demo">
//       <div style={{ padding: 8 }}>
//         <div
//           ref={mapContainerRef}
//           className="max-cell-xl"
//           style={{ height: 720 }}
//         />
//         <div
//           ref={pushpinControlRef}
//           className="custom-ol-control custom-ol-control-pushpin"
//         >
//           <Switch
//             checkedChildren={<PushpinOutlined />}
//             unCheckedChildren={<PushpinOutlined />}
//             onChange={onChangePushpinControl}
//             checked={pushpinModeActive}
//           />
//         </div>
//       </div>
//     </AppPage>
//   );
// }
