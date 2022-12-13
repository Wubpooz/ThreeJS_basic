import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { ceilPowerOfTwo } from 'three/src/math/MathUtils'


//Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('../static/textures/NormalMap.png')
//const cross = textureLoader.load('../static/textures/cross.png')
const cross = textureLoader.load('../static/textures/circle.png')

// Debug
const gui = new dat.GUI()
dat.GUI.toggleHide();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereGeometry(.5,64,64);

const partGeo = new THREE.BufferGeometry;
const partCnt = 1000;

const posArray = new Float32Array(partCnt*3);
for(let i=0;i<partCnt*3;i++){
    posArray[i] = (Math.random()*5)*(Math.random()-.5)
}
partGeo.setAttribute('position', new THREE.BufferAttribute(posArray,3))

// Materials
/*const material = new THREE.MeshStandardMaterial()
material.metalness = .8
material.roughness = .2
material.normalMap = normalTexture
material.color = new THREE.Color(0x292929)*/
const material = new THREE.PointsMaterial({size : .005})
const particulematerial = new THREE.PointsMaterial({
    size : .005,
    blending : THREE.AdditiveBlending,
    transparent : true,
    sizeAttenuation : true,
    map : cross
})

// Mesh
//const sphere = new THREE.Mesh(geometry,material)
const sphere = new THREE.Points(geometry,material)
const partMesh = new THREE.Points(partGeo,particulematerial)
scene.add(sphere,partMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(-1.22,1.4,-2.32)
pointLight2.intensity=2
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0x67ff, 2)
pointLight3.position.set(1.32,-1.52,-1.38)
pointLight3.intensity=1.36
scene.add(pointLight3)



/* GUI
const light2 = gui.addFolder('Light 2')
light2.add(pointLight2.position,'x').min(-3).max(3).step(.02)
light2.add(pointLight2.position,'y').min(-3).max(3).step(.02)
light2.add(pointLight2.position,'z').min(-3).max(3).step(.02)
light2.add(pointLight2,'intensity').min(0).max(10).step(.02)

const light2Color = {color : 0xff0000}
light2.addColor(light2Color, 'color').onChange( () => {pointLight2.color.set(light2Color.color)})*/

// HELPERS
// const pointLightHelper = new THREE.PointLightHelper(pointLight2,1)
// scene.add(pointLightHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


if ( renderer.capabilities.isWebGL2 === false && renderer.extensions.has( 'ANGLE_instanced_arrays' ) === false ) {
    document.getElementById( 'notSupported' ).style.display = '';
}

/**
 * Animate
 */
document.addEventListener('mousemove',onDocumentMouseMove)

let mouseX=0; let mouseY=0; let targetX=0; let targetY=0;
const halfX=window.innerWidth/2;
const halfY=window.innerHeight/2;

function onDocumentMouseMove(event) {
    mouseX  = (event.clientX - halfX)
    mouseY = (event.clientY - halfY)
}

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX*.001
    targetY = mouseY*.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y+=.5*(targetX-sphere.rotation.y)
    sphere.rotation.x+=.05*(targetX-sphere.rotation.x)
    sphere.rotation.z+=.05*(targetX-sphere.rotation.x)
    partMesh.rotation.y+=.05*(targetX-partMesh.rotation.y)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()