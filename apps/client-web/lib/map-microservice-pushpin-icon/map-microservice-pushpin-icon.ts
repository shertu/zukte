import Icon from 'ol/style/Icon';

const mapPushpinImage: HTMLImageElement = new Image(20, 25);
mapPushpinImage.src =
  'https://upload.wikimedia.org/wikipedia/commons/8/88/Map_marker.svg';

const mapPushpinIcon = new Icon({
  anchor: [0.5, 1],
  img: mapPushpinImage,
  imgSize: [mapPushpinImage.width, mapPushpinImage.height],
});

export {mapPushpinIcon};
