import * as THREE from 'three/webgpu'
import { color, mix, positionLocal, sin, time } from 'three/tsl'

/**
 * Zet de achtergrondscène op in het gegeven canvas.
 * Geeft een object terug met dispose() om alles op te ruimen.
 */
export function createScene(canvas) {
  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight, false)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x05070a)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 6)

  // TSL-materiaal: kleurverloop dat langs het object meebeweegt in de tijd
  const material = new THREE.MeshStandardNodeMaterial({ roughness: 0.4, metalness: 0.2 })
  const wave = sin(positionLocal.y.mul(3).add(time.mul(1.5))).mul(0.5).add(0.5)
  material.colorNode = mix(color(0x1b2a41), color(0xd4a35a), wave)

  const geometry = new THREE.TorusKnotGeometry(1, 0.32, 200, 32)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const light = new THREE.DirectionalLight(0xffffff, 2)
  light.position.set(3, 4, 5)
  scene.add(light)

  const timer = new THREE.Timer()

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight, false)
  }
  window.addEventListener('resize', onResize)

  renderer.setAnimationLoop((timestamp) => {
    timer.update(timestamp)
    const delta = timer.getDelta()
    mesh.rotation.x += delta * 0.3
    mesh.rotation.y += delta * 0.5
    renderer.render(scene, camera)
  })

  return {
    dispose() {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', onResize)
      timer.dispose()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
