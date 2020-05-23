const debug = false;
let tempMatrix = new THREE.Matrix4();
let tempVector = new THREE.Vector3();
let camera, scene, renderer, container;
let conLeft, conRight, xrConLeft, xrConRight;
let light, testCube;

let piece1, piece2, piece3, pieceGroup;

init();
requestSession();

window.addEventListener("unload", closeSession);

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  // conLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  // conRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
  // scene.add(conLeft, conRight);

  // testCube = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  // testCube.position.z -= 1;
  // testCube.position.y += 0.5;
  // scene.add(testCube);

  // Create Triangles
  var normalMap = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1385231/metal-seamless-normal-mapping.jpg"
  );
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  var material = new THREE.MeshPhongMaterial({
    color: 0xf6c12a,
    normalMap: normalMap,
    shininess: 70
  });

  var shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(2, 3);
  shape.lineTo(4, 0);
  shape.lineTo(0, 0);

  var extrudeSettings = {
    steps: 5,
    depth: 1,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.5,
    bevelOffset: 0,
    bevelSegments: 1
  };

  var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

  // Sets the origin to the center of geometry for rotation
  geometry.center();

  piece1 = new THREE.Mesh(geometry, material);
  piece2 = new THREE.Mesh(geometry, material);
  piece3 = new THREE.Mesh(geometry, material);

  piece1.position.x = -3.9;
  piece1.position.y = -3;
  piece1.scale.set(1.5, 1.5, 1.5);

  piece2.position.x = 3.9;
  piece2.position.y = -3;
  piece2.scale.set(1.5, 1.5, 1.5);

  piece3.position.x = 0;
  piece3.position.y = 3;
  piece3.scale.set(1.5, 1.5, 1.5);

  pieceGroup = new THREE.Group();
  pieceGroup.add(piece1);
  pieceGroup.add(piece2);
  pieceGroup.add(piece3);
  pieceGroup.scale.set(0.03, 0.03, 0.03);
  pieceGroup.position.y = 1;
  pieceGroup.position.z = -1;
  scene.add(pieceGroup);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.xr.enabled = true;
}

function requestSession() {
  navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
    let options = { optionalFeatures: ['local-floor', 'bounded-floor'] };
    navigator.xr.requestSession('immersive-vr', options).then(onSessionStarted);
  });
}

function onSessionStarted(session) {
  renderer.xr.setSession(session);
  xrConLeft = renderer.xr.getController(0);
  xrConRight = renderer.xr.getController(1);
  animate();
}

async function closeSession(session) {
  await renderer.xr.getSession().end();
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render(a) {
  // conLeft.position.x = xrConLeft.position.x;
  // conLeft.position.y = xrConLeft.position.y;
  // conLeft.position.z = xrConLeft.position.z;
  // conLeft.rotation.x = xrConLeft.rotation.x;
  // conLeft.rotation.y = xrConLeft.rotation.y;
  // conLeft.rotation.z = xrConLeft.rotation.z;

  // conRight.position.x = xrConRight.position.x;
  // conRight.position.y = xrConRight.position.y;
  // conRight.position.z = xrConRight.position.z;
  // conRight.rotation.x = xrConRight.rotation.x;
  // conRight.rotation.y = xrConRight.rotation.y;
  // conRight.rotation.z = xrConRight.rotation.z;

  const frame = Math.floor(a % 10000) * 0.0001;
  const rotationCoordinate = d3.easeCubic(frame) * Math.PI * 2;

  piece1.rotation.x = rotationCoordinate;
  piece1.rotation.y = rotationCoordinate;
  piece2.rotation.x = rotationCoordinate * -1;
  piece2.rotation.y = rotationCoordinate * -1;
  piece3.rotation.x = rotationCoordinate;
  piece3.rotation.y = rotationCoordinate * -1;

  renderer.render(scene, camera);
}