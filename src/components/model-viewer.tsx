"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, invalidate, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

/**
 * React Bits의 ModelViewer — 홀드를 손으로 돌려보는 뷰어.
 *
 * 원본과 다른 점
 * - glb/gltf만 받는다. fbx/obj 로더는 쓸 일이 없어 뺐다(번들이 그만큼 줄어든다).
 * - 스크린샷 버튼 제거 — 프로젝트에 없는 UI다.
 * - Environment preset 제거. drei의 프리셋은 외부 CDN에서 HDR을 받아오는데,
 *   전시용 사이트가 남의 CDN에 묶이는 게 맞지 않아 조명 네 개로 직접 세웠다.
 * - 색·로더는 프로젝트 토큰을 따른다.
 *
 * frameloop="demand" — 가만히 있을 때는 렌더를 멈춘다. 아카이브에 얹어두고
 * 계속 GPU를 돌리면 배터리만 먹는다.
 */
const deg2rad = (d: number) => (d * Math.PI) / 180;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const HOVER_MAG = deg2rad(6);
const HOVER_EASE = 0.15;

const isTouch =
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span className="text-label text-ink-muted uppercase">{Math.round(progress)}%</span>
    </Html>
  );
}

function Controls({ pivot, min, max }: { pivot: THREE.Vector3; min: number; max: number }) {
  const ref = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  useFrame(() => ref.current?.target.copy(pivot));
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom
      minDistance={min}
      maxDistance={max}
    />
  );
}

interface ModelProps {
  url: string;
  pivot: THREE.Vector3;
  initYaw: number;
  initPitch: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  hoverRotation: boolean;
}

function Model({
  url,
  pivot,
  initYaw,
  initPitch,
  autoRotate,
  autoRotateSpeed,
  hoverRotation,
}: ModelProps) {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const { gl } = useThree();

  const vel = useRef({ x: 0, y: 0 });
  const targetHover = useRef({ x: 0, y: 0 });
  const currentHover = useRef({ x: 0, y: 0 });
  const pivotWorld = useRef(new THREE.Vector3());

  const { scene } = useGLTF(url);
  const content = useMemo(() => scene.clone(), [scene]);

  // 모델마다 크기가 제각각이라 바운딩 구로 정규화해 항상 같은 크기로 보이게 한다
  useLayoutEffect(() => {
    const g = inner.current;
    if (!g) return;
    g.updateWorldMatrix(true, true);

    const sphere = new THREE.Box3().setFromObject(g).getBoundingSphere(new THREE.Sphere());
    const s = 1 / (sphere.radius * 2);
    g.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
    g.scale.setScalar(s);

    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    g.getWorldPosition(pivotWorld.current);
    pivot.copy(pivotWorld.current);
    outer.current.rotation.set(initPitch, initYaw, 0);
    invalidate();
  }, [content, initPitch, initYaw, pivot]);

  // 드래그 회전
  useEffect(() => {
    const el = gl.domElement;
    let dragging = false;
    let lx = 0;
    let ly = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      outer.current.rotation.y += dx * ROTATE_SPEED;
      outer.current.rotation.x += dy * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
      invalidate();
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  // 커서를 따라 살짝 기우는 정도. 터치에선 끈다
  useEffect(() => {
    if (!hoverRotation || isTouch) return;
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      targetHover.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG };
      invalidate();
    };
    const onLeave = () => {
      targetHover.current = { x: 0, y: 0 };
      invalidate();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, hoverRotation]);

  useFrame((_, dt) => {
    let need = false;

    const px = currentHover.current.x;
    const py = currentHover.current.y;
    currentHover.current.x += (targetHover.current.x - currentHover.current.x) * HOVER_EASE;
    currentHover.current.y += (targetHover.current.y - currentHover.current.y) * HOVER_EASE;
    outer.current.rotation.x += currentHover.current.x - px;
    outer.current.rotation.y += currentHover.current.y - py;

    if (autoRotate) {
      outer.current.rotation.y += autoRotateSpeed * dt;
      need = true;
    }

    // 놓은 뒤 관성으로 조금 더 돈다
    outer.current.rotation.y += vel.current.x;
    outer.current.rotation.x += vel.current.y;
    vel.current.x *= INERTIA;
    vel.current.y *= INERTIA;

    if (Math.abs(vel.current.x) > 1e-4 || Math.abs(vel.current.y) > 1e-4) need = true;
    if (
      Math.abs(currentHover.current.x - targetHover.current.x) > 1e-4 ||
      Math.abs(currentHover.current.y - targetHover.current.y) > 1e-4
    )
      need = true;

    if (need) invalidate();
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={content} />
      </group>
    </group>
  );
}

export interface ModelViewerProps {
  url: string;
  className?: string;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  hoverRotation?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
}

export default function ModelViewer({
  url,
  className = "",
  defaultRotationX = -25,
  defaultRotationY = 20,
  defaultZoom = 1.1,
  minZoomDistance = 0.6,
  maxZoomDistance = 4,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  hoverRotation = true,
  ambientIntensity = 0.6,
  keyLightIntensity = 1.6,
  fillLightIntensity = 0.7,
  rimLightIntensity = 1,
}: ModelViewerProps) {
  // useRef(...).current를 렌더에서 읽으면 React 규칙 위반이라 useMemo로 잡는다
  const pivot = useMemo(() => new THREE.Vector3(), []);
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance);

  return (
    <div className={`relative h-full w-full cursor-grab active:cursor-grabbing ${className}`}>
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ fov: 45, position: [0, 0, camZ], near: 0.01, far: 100 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 5, 5]} intensity={keyLightIntensity} castShadow />
        <directionalLight position={[-5, 2, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <ContactShadows position={[0, -0.55, 0]} opacity={0.28} scale={6} blur={2.4} far={1.2} />

        <Suspense fallback={<Loader />}>
          <Model
            url={url}
            pivot={pivot}
            initYaw={deg2rad(defaultRotationX)}
            initPitch={deg2rad(defaultRotationY)}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            hoverRotation={hoverRotation}
          />
        </Suspense>

        {!isTouch ? <Controls pivot={pivot} min={minZoomDistance} max={maxZoomDistance} /> : null}
      </Canvas>
    </div>
  );
}
