
import './App.css';
import { useRef, useEffect, useMemo } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, Raycaster, Vector2, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import LeftMenu from './layouts/LeftMenu';
import PropertiesWindow from './layouts/PropertiesWindow';
import { Box, HStack } from '@chakra-ui/react';
import { useSelectedElement } from './context/selectedElementContext';


function App() {

  const { selectElement } = useSelectedElement();

  const renderer = new WebGLRenderer();
  const ref = useRef();
  const scene = useMemo(() => new Scene(), []);
  const camera = useMemo(() => new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000), []);
  const controls = new OrbitControls(camera, renderer.domElement);
  const dragControls = new DragControls(scene.children, camera, renderer.domElement);


  dragControls.addEventListener('dragstart', function (event) {

    console.log(event.object)

    event.object.material.emissive.set(0xaaaaaa);

  });

  const raycaster = new Raycaster();
  const pointer = new Vector2();

  controls.update();



  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      camera.aspect = ref.current?.clientWidth / ref.current?.clientHeight
      renderer.setSize(ref.current?.clientWidth, ref.current?.clientHeight);
      animate();
    });

    observer.observe(element);
    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect();
    };
  }, [])

  useEffect(() => {
    camera.aspect = ref.current?.clientWidth / ref.current?.clientHeight
    renderer.setSize(ref.current?.clientWidth, ref.current?.clientHeight);
    ref.current?.append(renderer.domElement)
  }, [scene, camera])



  function animate() {

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {
      selectElement(intersects[i].object);
    }

    requestAnimationFrame(animate);
    controls.update();
    renderer.setClearColor(0xffffff, 1)
    renderer.render(scene, camera);
  }


  return (
    <HStack flexDirection="row" h="full" w="full">
      <LeftMenu animate={animate} scene={scene} camera={camera} />
      <Box w="calc(100% - 500px)" h="full" ref={ref} id="root-container">

      </Box>
      <PropertiesWindow />
    </HStack>
  )
}

export default App