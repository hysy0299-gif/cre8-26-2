"use client";

import { useEffect, useRef } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import type { OGLRenderingContext } from "ogl";
import "./flying-posters.css";

/**
 * React Bits의 FlyingPosters — 사진이 한 장씩 떠올랐다 비틀리며 지나간다.
 *
 * 셰이더(회전·왜곡)와 배치 논리는 원본 그대로다. 바꾼 곳은 셋이다.
 *
 * 1. **페이지 스크롤로 움직인다.** 원본은 window의 wheel을 가로채고
 *    preventDefault까지 걸어서, 이 화면에 놓으면 페이지가 아예 안 내려간다.
 *    매니페스토에 이어 붙는 구간이라 같은 스크롤을 그대로 쓰는 게 맞다.
 * 2. **사진마다 제 비율로 선다.** 원본은 모든 판이 같은 크기라 비율이 다른 사진은
 *    셰이더가 잘라낸다. 여기서는 판을 사진 비율에 맞춰 잡아 자르지 않는다.
 * 3. **칸 간격은 사진 크기와 무관하게 일정하다.** 판 높이가 제각각이어도
 *    자리는 같은 간격으로 잡아 서로 겹치지 않는다.
 */
export interface PosterItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface FlyingPostersProps {
  items: PosterItem[];
  /** 한 장이 차지하는 자리의 최대 크기(화면 기준 비율). 사진은 이 안에 비율대로 들어간다 */
  boxWidth?: number;
  boxHeight?: number;
  /** 판이 비틀리는 정도 */
  distortion?: number;
  /** 스크롤을 따라가는 부드러움. 작을수록 늦게 따라온다 */
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
  /** 사진 한 장에 배정되는 스크롤 거리 */
  runway?: string;
  className?: string;
}

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uPosition;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                               0.0,                                0.0,                                1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotationMatrix(axis, angle) * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5 ? 16.0 * pow(t, 5.0) : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;

  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

/**
 * 원본은 여기서 판과 사진의 비율을 맞추느라 uv를 잘라냈다.
 * 판을 사진 비율로 잡아두면 그럴 일이 없어서 그대로 찍는다.
 */
const fragmentShader = `
precision highp float;

uniform sampler2D tMap;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tMap, vUv);
}
`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mapRange = (v: number, a1: number, b1: number, a2: number, b2: number) =>
  ((v - a1) / (b1 - a1)) * (b2 - a2) + a2;

interface Size {
  width: number;
  height: number;
}

class Media {
  plane: Mesh;
  program: Program;
  y = 0;

  constructor(
    private gl: OGLRenderingContext,
    geometry: Plane,
    scene: Transform,
    private item: PosterItem,
    private index: number,
    private length: number,
    private box: { w: number; h: number },
    private distortion: number,
    private screen: Size,
    private viewport: Size,
  ) {
    const texture = new Texture(gl, { generateMipmaps: false });

    this.program = new Program(gl, {
      depthTest: false,
      depthWrite: false,
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: distortion },
      },
      cullFace: false,
    });

    const img = new Image();
    img.decoding = "async";
    img.src = item.src;
    img.onload = () => {
      texture.image = img;
    };

    this.plane = new Mesh(gl, { geometry, program: this.program });
    this.plane.setParent(scene);

    this.layout();
  }

  /** 자리 사이 간격. 판 크기와 무관하게 일정해야 겹치지 않는다 */
  get slot() {
    return ((this.viewport.height * this.box.h) / this.screen.height) * 1.35;
  }

  get total() {
    return this.slot * this.length;
  }

  layout() {
    // 사진 비율 그대로, 상자 안에 들어가는 가장 큰 크기
    const aspect = this.item.width / this.item.height;
    let pw = this.box.w;
    let ph = pw / aspect;
    if (ph > this.box.h) {
      ph = this.box.h;
      pw = ph * aspect;
    }

    this.plane.scale.x = (this.viewport.width * pw) / this.screen.width;
    this.plane.scale.y = (this.viewport.height * ph) / this.screen.height;
    this.plane.position.x = 0;

    this.y = -this.total / 2 + (this.index + 0.5) * this.slot;
  }

  resize(screen: Size, viewport: Size) {
    this.screen = screen;
    this.viewport = viewport;
    this.layout();
  }

  update(scroll: number) {
    this.plane.position.y = this.y - scroll;
    this.program.uniforms.uPosition.value = mapRange(
      this.plane.position.y,
      -this.viewport.height,
      this.viewport.height,
      5,
      15,
    );
  }
}

class Posters {
  private renderer: Renderer;
  private gl: OGLRenderingContext;
  private camera: Camera;
  private scene: Transform;
  private geometry: Plane;
  private medias: Media[] = [];
  private screen: Size = { width: 1, height: 1 };
  private viewport: Size = { width: 1, height: 1 };
  private scroll = { current: 0, target: 0, ease: 0.06 };
  private raf = 0;

  constructor(
    private container: HTMLElement,
    canvas: HTMLCanvasElement,
    private items: PosterItem[],
    private boxRatio: { w: number; h: number },
    distortion: number,
    scrollEase: number,
    cameraFov: number,
    cameraZ: number,
  ) {
    this.scroll.ease = scrollEase;

    this.renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    this.gl = this.renderer.gl;

    this.camera = new Camera(this.gl);
    this.camera.fov = cameraFov;
    this.camera.position.z = cameraZ;

    this.scene = new Transform();
    this.resize();

    this.geometry = new Plane(this.gl, { heightSegments: 1, widthSegments: 100 });
    this.medias = items.map(
      (item, i) =>
        new Media(
          this.gl,
          this.geometry,
          this.scene,
          item,
          i,
          items.length,
          this.box,
          distortion,
          this.screen,
          this.viewport,
        ),
    );

    // 첫 장이 가운데 서 있는 상태에서 시작한다
    this.scroll.current = this.scroll.target = this.scrollAt(0);
    this.tick();
  }

  private get box() {
    return {
      w: this.screen.width * this.boxRatio.w,
      h: this.screen.height * this.boxRatio.h,
    };
  }

  /** 진행도 0~1을 스크롤 값으로. 0이면 첫 장, 1이면 마지막 장이 가운데 온다 */
  private scrollAt(p: number) {
    const first = this.medias[0];
    if (!first) return 0;
    return first.y + p * (this.items.length - 1) * first.slot;
  }

  setProgress(p: number) {
    this.scroll.target = this.scrollAt(p);
  }

  resize = () => {
    const rect = this.container.getBoundingClientRect();
    this.screen = { width: rect.width, height: rect.height };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { height, width: height * (this.camera as { aspect: number }).aspect };

    this.medias.forEach((m) => {
      m.resize(this.screen, this.viewport);
      // 판 크기가 바뀌면 상자도 다시 잡아줘야 한다
      Object.assign(m as unknown as { box: { w: number; h: number } }, { box: this.box });
      m.layout();
    });
  };

  private tick = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    this.medias.forEach((m) => m.update(this.scroll.current));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.raf = requestAnimationFrame(this.tick);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
  }
}

export function FlyingPosters({
  items,
  boxWidth = 0.52,
  boxHeight = 0.62,
  distortion = 3,
  scrollEase = 0.06,
  cameraFov = 45,
  cameraZ = 20,
  runway = "120vh",
  className = "",
}: FlyingPostersProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const track = runwayRef.current;
    if (!stage || !canvas || !track || !items.length) return;

    const posters = new Posters(
      stage,
      canvas,
      items,
      { w: boxWidth, h: boxHeight },
      distortion,
      scrollEase,
      cameraFov,
      cameraZ,
    );

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight || 1;
      posters.setProgress(Math.min(1, Math.max(0, -rect.top / span)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", posters.resize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", posters.resize);
      posters.destroy();
    };
  }, [items, boxWidth, boxHeight, distortion, scrollEase, cameraFov, cameraZ]);

  return (
    <div className={`w-full ${className}`}>
      <div ref={runwayRef} style={{ height: `calc(${runway} * ${items.length})` }}>
        <div ref={stageRef} className="posters-stage bg-ground sticky top-0 h-dvh w-full">
          <canvas ref={canvasRef} className="posters-canvas" />
        </div>
      </div>

      {/* 캔버스라 스크린리더가 못 읽는다. 사진 설명을 따로 둔다 */}
      <ul className="sr-only">
        {items.map((it) => (
          <li key={it.src}>{it.alt}</li>
        ))}
      </ul>
    </div>
  );
}
