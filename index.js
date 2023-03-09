import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ 121.434765, 31.256735 ],
    zoom: 14.83
  })
});
scene.addImage(
  '00',
  'https://i.52112.com/icon/256/20190905/57177/2543091.png'
);
scene.addImage(
  '01',
  'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg'
);
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg'
);


function initPlane() {
  const el = document.createElement('div');
  el.style.background = '#fff';
  el.style.position = 'absolute';
  el.style.padding = '10px';
  el.style.top = '0';
  el.style.right = '-120px';
  el.style.width = '100px';
  el.style.height = '100%';
  el.style.zIndex = '10';
  el.style.transition = '0.5s';
  // el.innerText = '123'
  const wrap = document.getElementById('map');
  wrap.appendChild(el);
  return el;
}

scene.on('loaded', () => {
  const plane = initPlane();
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json'
  )
    .then(res => res.json())
    .then(data => {
      const imageLayer = new PointLayer()
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude'
          }
        })
        .shape('name', [ '00', '01', '02' ])
        .size(25);
      scene.addLayer(imageLayer);
           imageLayer.on('click', e => {
        const { lng, lat } = e.lngLat;
        scene.setCenter([ lng, lat ], {
          padding: {
            right: 120
          }
        });
        plane.style.right = '0px';
        plane.innerHTML = `
          <p>click info</>
          <p>featureId: ${e.featureId}</p>
          <p>lng: ${lng}</p>
          <p>lat: ${lat}</p>
        `;
      });
      imageLayer.on('unclick', () => {
        plane.style.right = '-120px';
        scene.setCenter([ 121.434765, 31.256735 ], {
          padding: {
            right: 0
          }
        });
      });
    });
});
