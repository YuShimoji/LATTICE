import * as THREE from "three";

type CameraZone = "concourse" | "platform" | "gate";

const PALETTE = {
  fog: 0xb8c7be,
  concrete: 0x7f9086,
  paleConcrete: 0xc6d0c8,
  rail: 0x35453f,
  orange: 0xcf6c42,
  cyan: 0x5dc6b2,
  dark: 0x22312b,
  warm: 0xe7d6aa,
};

export class RenderSystem {
  readonly renderer: THREE.WebGLRenderer;
  readonly playerPosition = new THREE.Vector3(0, 0, 3);

  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(46, 1, 0.1, 150);
  private readonly player = new THREE.Group();
  private readonly gateCore = new THREE.Group();
  private readonly echo = new THREE.Group();
  private readonly terminalPulse: THREE.Mesh;
  private zone: CameraZone | null = null;
  private elapsed = 0;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.domElement.setAttribute("aria-label", "Fixed-camera view of abandoned Platform 06");
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(PALETTE.fog);
    this.scene.fog = new THREE.Fog(PALETTE.fog, 24, 62);
    this.createLights();
    this.createStation();
    this.createPlayer();
    this.terminalPulse = this.createTerminal();
    this.createGate();
    this.createEcho();
    this.resize();

    window.addEventListener("resize", this.resize);
    this.renderer.domElement.addEventListener("webglcontextlost", this.onContextLost);
    this.renderer.domElement.addEventListener("webglcontextrestored", this.onContextRestored);
  }

  update(deltaSeconds: number, gatePowered: boolean): void {
    this.elapsed += deltaSeconds;
    this.player.position.copy(this.playerPosition);
    this.player.position.y = 0.04 + Math.sin(this.elapsed * 5) * 0.025;
    this.terminalPulse.scale.setScalar(1 + Math.sin(this.elapsed * 3) * 0.05);

    const targetZone: CameraZone = this.playerPosition.z > -10 ? "concourse" : this.playerPosition.z > -28 ? "platform" : "gate";
    if (targetZone !== this.zone) this.cutCamera(targetZone);

    this.gateCore.visible = gatePowered;
    this.gateCore.rotation.z = Math.sin(this.elapsed * 0.8) * 0.04;
    this.echo.visible = gatePowered;
    const echoMaterial = this.echo.userData.material as THREE.MeshStandardMaterial;
    echoMaterial.opacity = gatePowered ? 0.45 + Math.sin(this.elapsed * 2.6) * 0.12 : 0;
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    window.removeEventListener("resize", this.resize);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);
    this.renderer.domElement.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.renderer.dispose();
  }

  private createLights(): void {
    this.scene.add(new THREE.HemisphereLight(0xeaf5ed, 0x53655c, 2.2));
    const sun = new THREE.DirectionalLight(0xfff4d5, 3.6);
    sun.position.set(10, 18, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 26;
    sun.shadow.camera.bottom = -26;
    this.scene.add(sun);
  }

  private material(color: number, roughness = 0.9, emissive = 0x000000): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05, emissive, emissiveIntensity: emissive ? 0.7 : 0 });
  }

  private box(size: readonly [number, number, number], position: readonly [number, number, number], color: number): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), this.material(color));
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  private createStation(): void {
    this.box([14, 0.35, 48], [0, -0.2, -17], PALETTE.paleConcrete);
    this.box([14, 0.12, 4], [0, 0, 3], PALETTE.warm);
    this.box([14, 0.15, 15], [0, -0.01, -19], 0x91a198);
    this.box([2.4, 0.12, 34], [-4.7, -0.02, -23], 0x65756d);
    this.box([2.4, 0.12, 34], [4.7, -0.02, -23], 0x65756d);

    for (const x of [-4.8, 4.8]) {
      this.box([0.12, 0.08, 34], [x - 0.55, 0.08, -23], PALETTE.rail);
      this.box([0.12, 0.08, 34], [x + 0.55, 0.08, -23], PALETTE.rail);
      for (let z = -39; z <= -8; z += 2) this.box([1.5, 0.07, 0.16], [x, 0.03, z], PALETTE.dark);
    }

    for (const z of [1.8, -1.6]) {
      for (const x of [-4, -1.35, 1.35, 4]) {
        const kiosk = this.box([1.25, 1.1, 0.7], [x, 0.55, z], 0x73867c);
        kiosk.rotation.y = z > 0 ? 0 : Math.PI;
        this.box([0.72, 0.32, 0.05], [x, 0.76, z + (z > 0 ? 0.37 : -0.37)], PALETTE.dark);
      }
    }

    for (const z of [-9, -17, -25, -33]) {
      this.box([0.45, 5.4, 0.45], [-6.15, 2.7, z], PALETTE.concrete);
      this.box([0.45, 5.4, 0.45], [6.15, 2.7, z], PALETTE.concrete);
      this.box([13, 0.3, 0.4], [0, 5.3, z], PALETTE.concrete);
    }

    for (const z of [-12, -16, -20, -24]) {
      this.box([1.8, 0.4, 0.7], [-1.7, 0.22, z], 0x9ba9a1);
      this.box([1.8, 0.4, 0.7], [1.7, 0.22, z], 0x9ba9a1);
    }

    const signMaterial = this.material(PALETTE.orange, 0.8, PALETTE.orange);
    for (const z of [-7.8, -18, -30]) {
      const sign = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.55, 0.12), signMaterial);
      sign.position.set(0, 3.9, z);
      this.scene.add(sign);
    }
  }

  private createPlayer(): void {
    const coat = this.material(0x263e35);
    const scarf = this.material(PALETTE.orange);
    const skin = this.material(0xb89071);
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.43, 0.9, 6), coat);
    torso.position.y = 0.95;
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.25, 1), skin);
    head.position.y = 1.62;
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.62, 0.24), this.material(0x3f554b));
    pack.position.set(0, 1.08, 0.28);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.06, 4, 8), scarf);
    band.position.y = 1.25;
    band.rotation.x = Math.PI / 2;
    this.player.add(torso, head, pack, band);
    for (const x of [-0.19, 0.19]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.24), coat);
      leg.position.set(x, 0.34, 0);
      this.player.add(leg);
    }
    this.player.traverse((object) => { if (object instanceof THREE.Mesh) object.castShadow = true; });
    this.scene.add(this.player);
  }

  private createTerminal(): THREE.Mesh {
    this.box([1.1, 1.3, 0.75], [2.3, 0.65, -18], 0x314b40);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.52, 0.06), this.material(PALETTE.cyan, 0.4, PALETTE.cyan));
    screen.position.set(2.3, 0.92, -17.6);
    this.scene.add(screen);
    const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), this.material(PALETTE.orange, 0.35, PALETTE.orange));
    beacon.position.set(2.3, 1.62, -18);
    this.scene.add(beacon);
    return beacon;
  }

  private createGate(): void {
    this.box([1.1, 5.4, 1.2], [-3.5, 2.7, -35], PALETTE.dark);
    this.box([1.1, 5.4, 1.2], [3.5, 2.7, -35], PALETTE.dark);
    this.box([8.1, 0.9, 1.2], [0, 5, -35], PALETTE.dark);
    for (const y of [0.8, 1.8, 2.8, 3.8]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(6, 0.055, 0.05), this.material(PALETTE.cyan, 0.2, PALETTE.cyan));
      beam.position.set(0, y, -34.4);
      this.gateCore.add(beam);
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.1, 5, 16), this.material(PALETTE.orange, 0.25, PALETTE.orange));
    ring.position.set(0, 2.7, -34.35);
    this.gateCore.add(ring);
    this.gateCore.visible = false;
    this.scene.add(this.gateCore);
  }

  private createEcho(): void {
    const material = new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 0.8, transparent: true, opacity: 0 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.48, 1.15, 5), material);
    body.position.y = 1;
    const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.27), material);
    head.position.y = 1.75;
    this.echo.add(body, head);
    this.echo.position.set(0, 0, -38.2);
    this.echo.userData.material = material;
    this.echo.visible = false;
    this.scene.add(this.echo);
  }

  private cutCamera(zone: CameraZone): void {
    this.zone = zone;
    if (zone === "concourse") {
      this.camera.position.set(10.5, 8.2, 8.5);
      this.camera.lookAt(0, 0.9, -3);
    } else if (zone === "platform") {
      this.camera.position.set(-11.5, 7.3, -14);
      this.camera.lookAt(0, 0.8, -20);
    } else {
      this.camera.position.set(10, 6.7, -29);
      this.camera.lookAt(0, 1.4, -36);
    }
  }

  private readonly resize = (): void => {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    const width = Math.max(parent.clientWidth, 1);
    const height = Math.max(parent.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private readonly onContextLost = (event: Event): void => {
    event.preventDefault();
    document.body.dataset.webgl = "lost";
  };

  private readonly onContextRestored = (): void => {
    delete document.body.dataset.webgl;
  };
}
