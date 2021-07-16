import 'ol/ol.css';

import * as ol from 'ol';

import {FormControlLabel, Switch} from '@material-ui/core';

import {AppHeader} from '../components/app-header/app-header';
import {AppPage} from '../components/app-page/app-page';
import Control from 'ol/control/Control';
import {Coordinate} from 'ol/coordinate';
import DrawInteraction from 'ol/interaction/Draw';
import GeomPoint from 'ol/geom/Point';
import GeometryType from 'ol/geom/GeometryType';
import OSMSource from 'ol/source/OSM';
import OlFeature from 'ol/Feature';
import OlIcon from 'ol/style/Icon';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import React from 'react';
import {Room} from '@material-ui/icons';
import {Style} from 'ol/style';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {defaults as defaultControls} from 'ol/control';
import {fromLonLat} from 'ol/proj';
import {mapPushpinIcon} from '../lib/map-microservice-pushpin-icon/map-microservice-pushpin-icon';

// .custom-ol-control-pushpin {
//   top: 65px;
//   left: 0.5em;
// }

// .ol-touch .custom-ol-control-pushpin {
//   top: 80px;
// }

// .custom-ol-control {
//   position: absolute;
//   background-color: hsla(0, 0%, 100%, 0.4);
//   border-radius: 4px;
//   padding: 2px;
// }

const melbourneCoordinate: Coordinate = fromLonLat([144.9631, -37.8136]);
const pointFeatureMelbourne = new OlFeature(new GeomPoint(melbourneCoordinate));
const osmLayer = new TileLayer<OSMSource>({source: new OSMSource()});

/**
 * A demonstration where the user can mark locations on a map.
 */
export function MapAtomicDemo() {
  const mapContainerRef = React.createRef<HTMLDivElement>();
  const pushpinControlRef = React.createRef<HTMLDivElement>();

  const [pushpinModeActive, setPushpinModeActive] =
    React.useState<boolean>(false);

  const [drawInteraction, setDrawInteraction] = React.useState<
    DrawInteraction | undefined
  >();

  const [map, setMap] = React.useState<OlMap | undefined>();

  const [pushpinLayerSource, setPushpinLayerSource] = React.useState<
    VectorSource<GeomPoint>
  >(
    new VectorSource({
      features: [pointFeatureMelbourne],
    })
  );

  /** Sets up the initial values for the open layers map. */
  React.useEffect(() => {
    const mapTarget = mapContainerRef.current;

    if (mapTarget) {
      const pushpinLayer = new VectorLayer({
        source: pushpinLayerSource,
        style: new Style({
          image: mapPushpinIcon,
        }),
      });

      const pushpinControl: Control = new Control({
        element: pushpinControlRef.current ?? undefined,
      });

      const mapView: OlView = new OlView({
        center: melbourneCoordinate,
        zoom: 3,
      });

      const newMapValue: OlMap = new OlMap({
        target: mapTarget ?? undefined,
        layers: [osmLayer, pushpinLayer],
        view: mapView,
        controls: defaultControls().extend([pushpinControl]),
      });

      setMap(newMapValue);
    }
  }, []);

  /** Handles a change to the pushpin mode. */
  React.useEffect(() => {
    if (map) {
      if (pushpinModeActive) {
        const newDrawInteractionValue: DrawInteraction = new DrawInteraction({
          source: pushpinLayerSource,
          type: GeometryType.POINT,
        });

        map.addInteraction(newDrawInteractionValue);
        setDrawInteraction(newDrawInteractionValue);
      } else {
        if (drawInteraction) {
          map.removeInteraction(drawInteraction);
        }
      }
    }
  }, [pushpinModeActive, map]);

  // /** */
  // function addPointFeatureToPushpinSource() {
  //  const longitude: number = chance.longitude();
  //  const latitude: number = chance.latitude();
  //  const coord: Coordinate = fromLonLat([longitude, latitude]);
  //  const geomP: GeomPoint = new GeomPoint(coord);
  //  const pointFeature: OlFeature<GeomPoint> =
  // new OlFeature<GeomPoint>(geomP);

  //  pushpinLayerSource.addFeature(pointFeature);
  //  console.log('addPointFeatureToPushpinSource with coord: ', coord);
  // }

  /**
   * Handles the change of state for the pushpin mode switch.
   */
  function onChangePushpinControl(
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    setPushpinModeActive(checked);
  }

  return (
    <>
      <AppHeader />
      <AppPage pageTitle="Map Demo">
        <div style={{padding: 8}}>
          <div
            ref={mapContainerRef}
            className="max-cell-xl"
            style={{height: 720}}
          />
          <div
            ref={pushpinControlRef}
            className="custom-ol-control custom-ol-control-pushpin"
          >
            <FormControlLabel
              control={
                <Switch
                  checked={pushpinModeActive}
                  onChange={onChangePushpinControl}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Primary"
            />
          </div>
        </div>
      </AppPage>
    </>
  );
}
