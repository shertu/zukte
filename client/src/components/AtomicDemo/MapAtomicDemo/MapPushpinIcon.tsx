import {Icon} from 'ol/style';
import Canvg from 'canvg';

const mapPushpinImage: HTMLImageElement = new Image(20, 25);
mapPushpinImage.src = 'https://upload.wikimedia.org/wikipedia/commons/8/88/Map_marker.svg';

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = mapPushpinImage.width;
canvas.height = mapPushpinImage.height;

const ctx = canvas.getContext('2d');
Canvg.from(ctx, mapPushpinImage.src)
    .then((res) => res.render());

const mapPushpinIcon: Icon = new Icon({
  anchor: [0.5, 1],
  img: canvas,
  imgSize: [canvas.width, canvas.height],
});

export {mapPushpinIcon, mapPushpinImage};
