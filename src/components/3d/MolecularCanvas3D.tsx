import React, { useEffect, useRef } from 'react';

interface MolecularCanvas3DProps {
  className?: string;
  nodeCount?: number;
  interactive?: boolean;
}

interface AtomNode {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  glowColor: string;
}

export const MolecularCanvas3D: React.FC<MolecularCanvas3DProps> = ({
  className = '',
  nodeCount = 42,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 3D Atoms in spherical & helical molecular clusters
    const nodes: AtomNode[] = [];
    const colors = [
      { fill: '#18A6A6', glow: 'rgba(24, 166, 166, 0.4)' }, // Cyan / Teal Active Pharma
      { fill: '#0EA5E9', glow: 'rgba(14, 165, 233, 0.4)' }, // Sky Blue Molecule
      { fill: '#10243A', glow: 'rgba(16, 36, 58, 0.25)' },  // Deep Corporate Navy
      { fill: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' }, // Emerald Bioactive
      { fill: '#38BDF8', glow: 'rgba(56, 189, 248, 0.3)' }, // Soft Crystal
    ];

    const radiusBound = Math.min(width, height) * 0.42;

    for (let i = 0; i < nodeCount; i++) {
      // Golden spiral distribution on sphere with slight helical offset
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = radiusBound * (0.6 + Math.random() * 0.4);

      const colorPick = colors[i % colors.length];

      nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        baseRadius: 3.5 + Math.random() * 4,
        color: colorPick.fill,
        glowColor: colorPick.glow,
      });
    }

    let rotX = 0.002;
    let rotY = 0.0035;
    let targetRotX = 0.002;
    let targetRotY = 0.0035;
    let angleX = 0;
    let angleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - height / 2;
      targetRotY = (mouseX / width) * 0.015;
      targetRotX = -(mouseY / height) * 0.015;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const fov = 420;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth dampening towards target rotation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      angleX += rotX + 0.0015;
      angleY += rotY + 0.002;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Transform all nodes in 3D space
      const projected = nodes.map((node) => {
        // Rotate Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        // Perspective projection
        const scale = fov / (fov + z2 + radiusBound * 1.2);
        const x2d = x1 * scale + width / 2;
        const y2d = y2 * scale + height / 2;
        const r2d = Math.max(1.2, node.baseRadius * scale);

        return {
          ...node,
          x2d,
          y2d,
          r2d,
          z: z2,
          scale,
        };
      });

      // Sort by Z for proper depth buffering (back-to-front rendering)
      projected.sort((a, b) => b.z - a.z);

      // 1. Draw 3D Molecular Bonds (Connecting lines between close atoms)
      const maxDistance = 140;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];

          const dx = a.x2d - b.x2d;
          const dy = a.y2d - b.y2d;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35 * Math.min(a.scale, b.scale);
            ctx.beginPath();
            ctx.moveTo(a.x2d, a.y2d);
            ctx.lineTo(b.x2d, b.y2d);
            ctx.strokeStyle = `rgba(24, 166, 166, ${alpha})`;
            ctx.lineWidth = 1.2 * Math.min(a.scale, b.scale);
            ctx.stroke();
          }
        }
      }

      // 2. Draw 3D Spherical Atoms with Specular Lighting
      projected.forEach((node) => {
        const alpha = Math.min(1, Math.max(0.2, 0.4 + (node.scale - 0.5) * 1.2));

        // Outer glow
        const glowRadius = node.r2d * 2.8;
        const glowGrad = ctx.createRadialGradient(
          node.x2d,
          node.y2d,
          node.r2d * 0.5,
          node.x2d,
          node.y2d,
          glowRadius
        );
        glowGrad.addColorStop(0, node.glowColor);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x2d, node.y2d, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3D Sphere gradient with top-left specular highlight
        const sphereGrad = ctx.createRadialGradient(
          node.x2d - node.r2d * 0.35,
          node.y2d - node.r2d * 0.35,
          node.r2d * 0.1,
          node.x2d,
          node.y2d,
          node.r2d
        );
        sphereGrad.addColorStop(0, '#FFFFFF');
        sphereGrad.addColorStop(0.3, node.color);
        sphereGrad.addColorStop(1, '#081726');

        ctx.fillStyle = sphereGrad;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(node.x2d, node.y2d, node.r2d, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodeCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none block ${className}`}
      aria-hidden="true"
    />
  );
};
