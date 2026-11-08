// MoodyDesigns Particle Engine - Finalized HDR Vortex
(function() {
    function initParticles() {
        const heroSection = document.querySelector('section#CT3GCuEKhZ3EMBx2');
        if (!heroSection) return;
        if (document.getElementById('moody-particles') || heroSection.querySelector('#moody-particles')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'moody-particles';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '5'; 
        canvas.style.pointerEvents = 'none';
        
        heroSection.style.position = 'relative'; 
        heroSection.appendChild(canvas);

        const w = heroSection.offsetWidth || window.innerWidth;
        const h = heroSection.offsetHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, w / (h || 1), 0.1, 100);
        camera.position.set(0, 0, 9.2);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;

        const particleCount = 62000;
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const basePositions = new Float32Array(particleCount * 3);
        const curveCoords = new Float32Array(particleCount);
        const phases = new Float32Array(particleCount);
        const rows = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount);
        const densities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const isRowTwo = (i % 2 === 0);
            rows[i] = isRowTwo ? 1.0 : 0.0;
            const normalizedCoord = i / particleCount;
            curveCoords[i] = normalizedCoord;

            const t = normalizedCoord * Math.PI * 7.0;
            const xSpread = (normalizedCoord - 0.5) * 14.0;
            const funnelRadius = 0.5 + Math.pow(normalizedCoord, 1.4) * 3.8;
            const rOffset = (Math.random() > 0.35) ? (Math.random() - 0.5) * 0.28 : (Math.random() - 0.5) * 1.1;
            densities[i] = (Math.random() > 0.35) ? 1.0 : 0.35;

            const angle = t + (isRowTwo ? Math.PI : 0.0) + (Math.random() - 0.5) * 0.15;
            
            positions[i3] = basePositions[i3] = xSpread + (Math.random() - 0.5) * 0.4;
            positions[i3 + 1] = basePositions[i3 + 1] = Math.sin(angle) * (funnelRadius + rOffset) * 0.75;
            positions[i3 + 2] = basePositions[i3 + 2] = Math.cos(angle) * (funnelRadius + rOffset) * 1.1;

            phases[i] = Math.random() * Math.PI * 2.0;
            speeds[i] = Math.random() * 0.4 + 0.8;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aBasePos', new THREE.BufferAttribute(basePositions, 3));
        geometry.setAttribute('aCurveCoord', new THREE.BufferAttribute(curveCoords, 1));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('aRow', new THREE.BufferAttribute(rows, 1));
        geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
        geometry.setAttribute('aDensity', new THREE.BufferAttribute(densities, 1));

        const vertexShader = `
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uMouseActive;
            
            attribute float aCurveCoord;
            attribute float aPhase;
            attribute float aRow;
            attribute float aSpeed;
            attribute float aDensity;
            attribute vec3 aBasePos;
            
            varying vec3 vColor;
            varying float vAlpha;

            vec3 getHDRSpectrumColor(float progress) {
                float p = mod(progress, 7.0);
                int idx = int(floor(p));
                float f = fract(p);
                vec3 c[] = vec3[](vec3(2.5,0.1,0.2), vec3(2.5,0.8,0.1), vec3(2.0,1.5,0.1), vec3(0.1,2.0,0.5), vec3(0.1,1.5,2.5), vec3(0.3,0.8,2.5), vec3(1.8,0.2,2.5));
                return mix(c[idx], c[(idx+1)%7], f);
            }

            void main() {
                vec3 pos = aBasePos;
                float angle = uTime * aSpeed * 0.45 + aPhase;
                float wave = sin(uTime * 1.5 + pos.x * 0.45 + aRow * 3.14159) * 0.28;
                pos.y += sin(angle) * wave;
                pos.z += cos(angle) * wave * 0.8;
                
                // Mouse repulsion - weakened and bounded
                if (uMouseActive > 0.5) {
                    float distMouse = distance(pos.xy, uMouse);
                    if (distMouse < 1.5) pos.xy += normalize(pos.xy - uMouse) * (1.0 - distMouse / 1.5) * 1.2;
                }
                
                // Persistent Logo repulsion (Center) - stronger to ensure void
                float distLogo = distance(pos.xy, vec2(0.0, 0.0));
                if (distLogo < 2.0) pos.xy += normalize(pos.xy) * (1.0 - distLogo / 2.0) * 5.0;

                vColor = getHDRSpectrumColor((uTime / 2.0) + (aCurveCoord * 2.8 + aRow * 0.6));
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                vAlpha = clamp((0.9 + aDensity * 0.5) * (0.9 + sin(uTime * 2.5 + aPhase) * 0.1), 0.5, 1.0);
                
                gl_PointSize = (26.0 / -mvPosition.z) * (0.9 + aDensity * 0.5);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
                float d = length(gl_PointCoord - vec2(0.5));
                if (d > 0.5) discard;
                
                float core = smoothstep(0.35, 0.0, d) * 1.5;
                gl_FragColor = vec4(vColor * (0.8 + core * 1.0) + vec3(smoothstep(0.2, 0.0, d) * 2.0), (smoothstep(0.5, 0.0, d) + core * 0.8) * vAlpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0.0 },
                uMouse: { value: new THREE.Vector2(999, 999) },
                uMouseActive: { value: 0.0 }
            },
            vertexShader, fragmentShader,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });

        const particleMesh = new THREE.Points(geometry, material);
        particleMesh.position.y = 2.2; 
        particleMesh.position.x = -0.5;
        particleMesh.rotation.set(0.12, -0.18, -0.06);
        scene.add(particleMesh);

        // Interaction
        let targetRotationX = 0.12;
        let targetRotationY = -0.18;
        let lastMouseMoveTime = 0;

        window.addEventListener('mousemove', (e) => {
            lastMouseMoveTime = performance.now();
            
            const rect = heroSection.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * 20 - 10;
            const mouseY = -((e.clientY - rect.top) / rect.height) * 20 + 10;
            
            material.uniforms.uMouse.value.set(mouseX - particleMesh.position.x, mouseY - particleMesh.position.y);
            material.uniforms.uMouseActive.value = 1.0;

            // Rotation based on cursor position (-45 to 45 degrees)
            const normX = ((e.clientX / window.innerWidth) - 0.5) * 2;
            const normY = ((e.clientY / window.innerHeight) - 0.5) * 2;
            targetRotationY = -0.18 + (normX * (Math.PI / 4));
            targetRotationX = 0.12 + (normY * (Math.PI / 4));
        });

        function render(time) {
            requestAnimationFrame(render);
            material.uniforms.uTime.value = time * 0.001;
            
            // Revert rotation if idle for 2 seconds
            if (time - lastMouseMoveTime > 2000) {
                targetRotationX = 0.12;
                targetRotationY = -0.18;
            }
            
            // Smoothly lerp towards target rotation
            particleMesh.rotation.x += (targetRotationX - particleMesh.rotation.x) * 0.05;
            particleMesh.rotation.y += (targetRotationY - particleMesh.rotation.y) * 0.05;
            
            renderer.render(scene, camera);
        }
        render(0);
    }
    window.addEventListener('load', initParticles);
})();