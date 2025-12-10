<script lang="ts">
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement | null = null;

    let columns = $state(10);
    let rows = $state(10);
    let mouseX = $state(0);
    let mouseY = $state(0);
    
    // Editable blob parameters
    let blobPoints = $state(8);
    let minRadiusMultiplier = $state(0.19);
    let maxRadiusMultiplier = $state(0.36);
    let circleRadius = $state(100);
    let nearColor = $state('#ff0000'); // Used for wave pulse color
    let gridColor = $state('#000000');
    let alpha = $state(0.7);
    let showBoxes = $state(false);
    let showControls = $state(true);
    
    // Animation state for continuous blob morphing and drifting
    let animationTime = $state(0);
    let animationFrameId: number | null = null;
    let lastTimestamp = 0;
    
    // Animation constants - very slow for meditative feel (10-15 second cycles)
    const ANIMATION_SPEED = 0.0005; // ~12 second full cycle
    const MORPH_INTENSITY = 0.25; // 25% radius variation
    const DRIFT_INTENSITY = 0.08; // 8% of cell size for position drift
    
    // Configurable physics parameters
    let waveForce = $state(4000); // Force applied by wave pulse (higher = stronger push)
    let friction = $state(0.985); // Less damping = blobs travel further
    let springForce = $state(0.004); // Weaker spring = slower return to original position
    let collisionBounce = $state(0.95); // Higher = bouncier collisions
    
    // Fixed physics constant
    const MIN_VELOCITY = 0.01; // Threshold to stop movement
    
    // Color palette presets
    const PALETTE_PRESETS: Record<string, string[]> = {
        sunset: ['#FF6B6B', '#FEC89A', '#FFD93D', '#FF8C42', '#C73E1D'],
        ocean: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#023E8A'],
        forest: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'],
        neon: ['#FF00FF', '#00FFFF', '#FF0080', '#80FF00', '#FFFF00'],
        monochrome: ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#E94560'],
        candy: ['#FF69B4', '#FFB6C1', '#DDA0DD', '#E6E6FA', '#F0E68C'],
        earth: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E']
    };
    
    let selectedPreset = $state<string>('sunset');
    let activePalette = $state<string[]>(PALETTE_PRESETS.sunset);
    
    function handlePaletteChange() {
        activePalette = PALETTE_PRESETS[selectedPreset];
        // Reassign colors to existing blobs
        blobDataCache.forEach((blob, index) => {
            blob.color = activePalette[index % activePalette.length];
        });
    }

    const setBoxes = (canvas: HTMLCanvasElement) => {
        const boxes = [];
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                boxes.push({ x: i * (canvas.width / columns), y: j * (canvas.height / rows), width: canvas.width / columns, height: canvas.height / rows });
            }
        }
        return boxes;
    };

    let boxes = $state<{ x: number, y: number, width: number, height: number }[]>([]);
    
    // Enhanced blob data structure for animation
    interface BlobPointData {
        angle: number;
        baseRadius: number;
        phaseOffset: number; // unique phase for organic movement
    }
    
    interface BlobData {
        basePoints: BlobPointData[];
        quadrant: { x: number; y: number; width: number; height: number };
        driftPhaseX: number; // unique phase for X position drift
        driftPhaseY: number; // unique phase for Y position drift
        // Physics properties
        offsetX: number; // Current displacement from base position
        offsetY: number;
        vx: number; // Velocity
        vy: number;
        mass: number; // For collision physics
        effectiveRadius: number; // For collision detection
        color: string; // Hex color assigned from palette
    }
    
    let blobDataCache = $state<BlobData[]>([]);
    
    // Wave pulse animation state
    interface WavePulse {
        x: number;
        y: number;
        startTime: number;
        maxRadius: number;
        duration: number;
        processedBlobs: Set<number>; // Track which blobs have been hit by this pulse
    }
    let wavePulses = $state<WavePulse[]>([]);
    const pulseMaxRadius = 500;
    const pulseDuration = 1200; // milliseconds

    function regenerateCanvas() {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                boxes = setBoxes(canvas);
                // Regenerate blob data with animation metadata
                blobDataCache = boxes.map((quadrant, index) => generateBlobData(quadrant, index));
                renderCanvas();
            }
        }
    }

    function resizeCanvas(cvs?: HTMLCanvasElement) {
        const target = cvs || canvas;
        if (target) {
            target.width = window.innerWidth;
            target.height = window.innerHeight;
            regenerateCanvas();
        }
    }

    function createboxes(
        ctx: CanvasRenderingContext2D | null, 
        canvas: HTMLCanvasElement, 
        boxes: { x: number, y: number, width: number, height: number }[]
    ) {
        if (ctx && showBoxes) {
            ctx.strokeStyle = gridColor;
            boxes.forEach(quadrant => {
                ctx.strokeRect(quadrant.x, quadrant.y, quadrant.width, quadrant.height);
            });
        }
    }

    function generateBlobData(
        quadrant: { x: number, y: number, width: number, height: number },
        index: number
    ): BlobData {
        const minRadius = Math.min(quadrant.width, quadrant.height) * minRadiusMultiplier;
        const maxRadius = Math.min(quadrant.width, quadrant.height) * maxRadiusMultiplier;

        // Generate base points with random radii and phase offsets
        const basePoints: BlobPointData[] = Array.from({ length: blobPoints }, (_, i) => ({
            angle: ((Math.PI * 2) / blobPoints) * i,
            baseRadius: minRadius + Math.random() * (maxRadius - minRadius),
            phaseOffset: Math.random() * Math.PI * 2 // Random phase for organic movement
        }));
        
        // Calculate average radius for collision detection
        const avgRadius = basePoints.reduce((sum, p) => sum + p.baseRadius, 0) / basePoints.length;

        return {
            basePoints,
            quadrant,
            driftPhaseX: Math.random() * Math.PI * 2,
            driftPhaseY: Math.random() * Math.PI * 2,
            // Initialize physics properties
            offsetX: 0,
            offsetY: 0,
            vx: 0,
            vy: 0,
            mass: 1 + Math.random() * 0.5, // Slight mass variation
            effectiveRadius: avgRadius * 1.1, // Collision radius slightly larger for more collisions
            color: activePalette[index % activePalette.length]
        };
    }

    function getAnimatedBlobPoints(
        blobData: BlobData,
        time: number
    ): { x: number; y: number }[] {
        const { basePoints, quadrant, driftPhaseX, driftPhaseY, offsetX, offsetY } = blobData;
        
        // Calculate center with drift offset
        const baseCenterX = quadrant.x + quadrant.width / 2;
        const baseCenterY = quadrant.y + quadrant.height / 2;
        
        // Apply slow drifting to the center position
        const driftRangeX = quadrant.width * DRIFT_INTENSITY;
        const driftRangeY = quadrant.height * DRIFT_INTENSITY;
        // Add physics offset to the center position
        const centerX = baseCenterX + Math.sin(time + driftPhaseX) * driftRangeX + offsetX;
        const centerY = baseCenterY + Math.sin(time * 0.7 + driftPhaseY) * driftRangeY + offsetY;
        
        // Generate animated points
        return basePoints.map(point => {
            // Morph the radius with sine wave based on time and unique phase offset
            const morphAmount = point.baseRadius * MORPH_INTENSITY;
            const animatedRadius = point.baseRadius + Math.sin(time + point.phaseOffset) * morphAmount;
            
            return {
                x: centerX + Math.cos(point.angle) * animatedRadius,
                y: centerY + Math.sin(point.angle) * animatedRadius
            };
        });
    }
    
    // Get the current center position of a blob (for physics calculations)
    function getBlobCenter(blobData: BlobData, time: number): { x: number; y: number } {
        const { quadrant, driftPhaseX, driftPhaseY, offsetX, offsetY } = blobData;
        const baseCenterX = quadrant.x + quadrant.width / 2;
        const baseCenterY = quadrant.y + quadrant.height / 2;
        const driftRangeX = quadrant.width * DRIFT_INTENSITY;
        const driftRangeY = quadrant.height * DRIFT_INTENSITY;
        
        return {
            x: baseCenterX + Math.sin(time + driftPhaseX) * driftRangeX + offsetX,
            y: baseCenterY + Math.sin(time * 0.7 + driftPhaseY) * driftRangeY + offsetY
        };
    }
    
    // Apply wave pulse force to blobs
    function applyWaveForces(deltaTime: number) {
        const now = Date.now();
        const waveWidth = 60; // Width of the wave ring that applies force
        
        wavePulses.forEach((pulse, pulseIndex) => {
            const elapsed = now - pulse.startTime;
            const progress = elapsed / pulse.duration;
            if (progress >= 1) return;
            
            const currentRadius = progress * pulse.maxRadius;
            // Force is stronger at the beginning, fades as wave expands
            const forceMultiplier = (1 - progress) * (1 - progress);
            
            blobDataCache.forEach((blob, blobIndex) => {
                // Skip if this blob was already hit by this pulse
                if (pulse.processedBlobs.has(blobIndex)) return;
                
                const center = getBlobCenter(blob, animationTime);
                const dx = center.x - pulse.x;
                const dy = center.y - pulse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Check if blob is within the wave ring
                if (distance > currentRadius - waveWidth && distance < currentRadius + waveWidth) {
                    // Mark this blob as processed by this pulse
                    pulse.processedBlobs.add(blobIndex);
                    
                    // Calculate force direction (away from pulse center)
                    const normalX = distance > 0 ? dx / distance : 0;
                    const normalY = distance > 0 ? dy / distance : 0;
                    
                    // Apply force
                    const force = waveForce * forceMultiplier / blob.mass;
                    blob.vx += normalX * force * deltaTime;
                    blob.vy += normalY * force * deltaTime;
                }
            });
        });
    }
    
    // Mix two hex colors by averaging their RGB values
    function mixColors(color1: string, color2: string): string {
        // Parse hex to RGB
        const parseHex = (hex: string) => {
            const clean = hex.replace('#', '');
            return {
                r: parseInt(clean.substring(0, 2), 16),
                g: parseInt(clean.substring(2, 4), 16),
                b: parseInt(clean.substring(4, 6), 16)
            };
        };
        
        const c1 = parseHex(color1);
        const c2 = parseHex(color2);
        
        // Average the RGB values
        const mixed = {
            r: Math.round((c1.r + c2.r) / 2),
            g: Math.round((c1.g + c2.g) / 2),
            b: Math.round((c1.b + c2.b) / 2)
        };
        
        // Convert back to hex
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(mixed.r)}${toHex(mixed.g)}${toHex(mixed.b)}`;
    }
    
    // Detect and resolve collisions between blobs
    function handleCollisions() {
        for (let i = 0; i < blobDataCache.length; i++) {
            for (let j = i + 1; j < blobDataCache.length; j++) {
                const blobA = blobDataCache[i];
                const blobB = blobDataCache[j];
                
                const centerA = getBlobCenter(blobA, animationTime);
                const centerB = getBlobCenter(blobB, animationTime);
                
                const dx = centerB.x - centerA.x;
                const dy = centerB.y - centerA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDist = blobA.effectiveRadius + blobB.effectiveRadius;
                
                if (distance < minDist && distance > 0) {
                    // Collision detected - calculate collision response
                    const normalX = dx / distance;
                    const normalY = dy / distance;
                    
                    // Relative velocity
                    const relVelX = blobA.vx - blobB.vx;
                    const relVelY = blobA.vy - blobB.vy;
                    const relVelDotNormal = relVelX * normalX + relVelY * normalY;
                    
                    // Only resolve if blobs are moving toward each other
                    if (relVelDotNormal > 0) {
                        // Calculate impulse scalar (using masses)
                        const totalMass = blobA.mass + blobB.mass;
                        const impulse = (2 * relVelDotNormal * collisionBounce) / totalMass;
                        
                        // Apply impulse to velocities
                        blobA.vx -= impulse * blobB.mass * normalX;
                        blobA.vy -= impulse * blobB.mass * normalY;
                        blobB.vx += impulse * blobA.mass * normalX;
                        blobB.vy += impulse * blobA.mass * normalY;
                        
                        // Separate blobs to prevent overlap
                        const overlap = minDist - distance;
                        const separationX = (overlap / 2) * normalX * 1.1;
                        const separationY = (overlap / 2) * normalY * 1.1;
                        
                        blobA.offsetX -= separationX;
                        blobA.offsetY -= separationY;
                        blobB.offsetX += separationX;
                        blobB.offsetY += separationY;
                        
                        // Mix colors on collision
                        const mixedColor = mixColors(blobA.color, blobB.color);
                        blobA.color = mixedColor;
                        blobB.color = mixedColor;
                    }
                }
            }
        }
    }
    
    // Update blob physics (velocity, position, spring back)
    function updateBlobPhysics(deltaTime: number) {
        blobDataCache.forEach(blob => {
            // Apply spring force to pull back to original position
            blob.vx -= blob.offsetX * springForce;
            blob.vy -= blob.offsetY * springForce;
            
            // Apply friction
            blob.vx *= friction;
            blob.vy *= friction;
            
            // Stop very slow movement
            if (Math.abs(blob.vx) < MIN_VELOCITY) blob.vx = 0;
            if (Math.abs(blob.vy) < MIN_VELOCITY) blob.vy = 0;
            
            // Update position offset
            blob.offsetX += blob.vx * deltaTime;
            blob.offsetY += blob.vy * deltaTime;
            
            // Clamp offset to prevent blobs from flying too far (larger range = more movement)
            const maxOffset = Math.min(blob.quadrant.width, blob.quadrant.height) * 3;
            blob.offsetX = Math.max(-maxOffset, Math.min(maxOffset, blob.offsetX));
            blob.offsetY = Math.max(-maxOffset, Math.min(maxOffset, blob.offsetY));
        });
    }

    function checkIsNearMouse(
        quadrant: { x: number, y: number, width: number, height: number }
    ): boolean {
        // Generate radial coordinates for a circle centered at the mouse position
            const circlePoints = 32;
            const radialCoordinates: { x: number; y: number }[] = Array.from({ length: circlePoints }, (_, i) => {
                const angle = (2 * Math.PI * i) / circlePoints;
                return {
                    x: mouseX + Math.cos(angle) * circleRadius,
                    y: mouseY + Math.sin(angle) * circleRadius
                };
            });
        return radialCoordinates.some(coord => 
            coord.x > quadrant.x - 10 && 
            coord.x < quadrant.x + quadrant.width + 10 && 
            coord.y > quadrant.y - 10 && 
            coord.y < quadrant.y + quadrant.height + 10
        );
    }

    // Brighten a hex color by a percentage (0-1)
    function brightenColor(hex: string, amount: number): string {
        const clean = hex.replace('#', '');
        const r = Math.min(255, Math.round(parseInt(clean.substring(0, 2), 16) * (1 + amount)));
        const g = Math.min(255, Math.round(parseInt(clean.substring(2, 4), 16) * (1 + amount)));
        const b = Math.min(255, Math.round(parseInt(clean.substring(4, 6), 16) * (1 + amount)));
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    function drawBlob(
        ctx: CanvasRenderingContext2D,
        blobData: { points: { x: number; y: number }[]; isNearMouse: boolean; color: string }
    ) {
        const points = blobData.points;
        if (points.length < 3) return;
        
        ctx.save();
        ctx.beginPath();
        
        // Use quadratic bezier curves for smooth blob shape
        // Start at the midpoint between the last and first point
        const startX = (points[points.length - 1].x + points[0].x) / 2;
        const startY = (points[points.length - 1].y + points[0].y) / 2;
        ctx.moveTo(startX, startY);
        
        // Draw smooth curves through midpoints, using actual points as control points
        for (let i = 0; i < points.length; i++) {
            const current = points[i];
            const next = points[(i + 1) % points.length];
            const midX = (current.x + next.x) / 2;
            const midY = (current.y + next.y) / 2;
            
            // Quadratic bezier: control point is the current point, end point is midpoint
            ctx.quadraticCurveTo(current.x, current.y, midX, midY);
        }
        
        ctx.closePath();
        // Use blob's own color, brighten on hover
        ctx.fillStyle = blobData.isNearMouse ? brightenColor(blobData.color, 0.4) : blobData.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    function drawWavePulses(ctx: CanvasRenderingContext2D) {
        const now = Date.now();
        
        // Draw active pulses
        wavePulses.forEach(pulse => {
            const elapsed = now - pulse.startTime;
            const progress = Math.min(elapsed / pulse.duration, 1);
            const currentRadius = progress * pulse.maxRadius;
            
            // Fade out as pulse expands
            const opacity = 1 - progress;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(pulse.x, pulse.y, currentRadius, 0, Math.PI * 2);
            ctx.strokeStyle = nearColor;
            ctx.globalAlpha = opacity * 0.8;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            ctx.restore();
        });
    }

    function renderCanvas() {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Clean up completed pulses
        const now = Date.now();
        wavePulses = wavePulses.filter(pulse => {
            const elapsed = now - pulse.startTime;
            return elapsed < pulse.duration;
        });
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createboxes(ctx, canvas, boxes);
        
        // Render blobs with animated positions
        blobDataCache.forEach(blobData => {
            const animatedPoints = getAnimatedBlobPoints(blobData, animationTime);
            const isNearMouse = checkIsNearMouse(blobData.quadrant);
            drawBlob(ctx, { points: animatedPoints, isNearMouse, color: blobData.color });
        });
        
        drawWavePulses(ctx);
    }

    function handleClick(event: MouseEvent) {
        // Create a new wave pulse at the click position
        wavePulses = [...wavePulses, {
            x: event.clientX,
            y: event.clientY,
            startTime: Date.now(),
            maxRadius: pulseMaxRadius,
            duration: pulseDuration,
            processedBlobs: new Set<number>()
        }];
        
        renderCanvas();
    }
    
    function animate(timestamp: number) {
        // Calculate delta time in seconds
        const deltaTime = lastTimestamp > 0 ? Math.min((timestamp - lastTimestamp) / 1000, 0.1) : 0.016;
        lastTimestamp = timestamp;
        
        animationTime = timestamp * ANIMATION_SPEED;
        
        // Run physics simulation
        applyWaveForces(deltaTime);
        handleCollisions();
        updateBlobPhysics(deltaTime);
        
        renderCanvas();
        animationFrameId = requestAnimationFrame(animate);
    }
    
    function startAnimation() {
        if (animationFrameId === null) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }
    
    function stopAnimation() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Watch for changes to parameters that require regeneration
    // $effect(() => {
    //     // Track variables that require blob point regeneration
    //     columns;
    //     rows;
    //     blobPoints;
    //     minRadiusMultiplier;
    //     maxRadiusMultiplier;
    //     showBoxes;
        
    //     if (canvas) {
    //         regenerateCanvas();
    //     }
    // });

    // Watch for changes to visual properties that only require redraw
    // $effect(() => {
    //     nearColor;
    //     farColor;
    //     alpha;
    //     circleRadius;
        
    //     if (canvas && blobPointsCache.length > 0) {
    //         const ctx = canvas.getContext('2d');
    //         if (ctx) {
    //             ctx.clearRect(0, 0, canvas.width, canvas.height);
    //             createboxes(ctx, canvas, boxes);
    //             blobPointsCache.forEach(({ points, quadrant }) => {
    //                 generateBlob(ctx, canvas!, quadrant, points);
    //             });
    //         }
    //     }
    // });

    onMount(() => {
        canvas = document.getElementById('site-canvas') as HTMLCanvasElement;
        resizeCanvas();
        if (canvas) {
            regenerateCanvas();
            // Start continuous animation loop
            startAnimation();
        }

        const onMouseMove = (event: MouseEvent) => {
            // Just update mouse position - animation loop handles rendering
            mouseX = event.clientX;
            mouseY = event.clientY;
        };
        
        const onClick = (event: MouseEvent) => {
            handleClick(event);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);
        
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            // Stop animation loop on unmount
            stopAnimation();
        };
    });

</script>

<div class="fixed top-4 right-4 z-50">
    {#if showControls}
        <div class="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[280px] max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Canvas Controls</h3>
                <button
                    onclick={() => showControls = false}
                    class="text-gray-500 hover:text-gray-700"
                    aria-label="Close controls"
                >
                    ✕
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label for="columns-input" class="block text-sm font-medium mb-1">Columns</label>
                    <input
                        id="columns-input"
                        type="number"
                        bind:value={columns}
                        min="1"
                        max="200"
                        class="w-full px-2 py-1 border rounded"
                    />
                </div>
                
                <div>
                    <label for="rows-input" class="block text-sm font-medium mb-1">Rows</label>
                    <input
                        id="rows-input"
                        type="number"
                        bind:value={rows}
                        min="1"
                        max="200"
                        class="w-full px-2 py-1 border rounded"
                    />
                </div>
                
                <div>
                    <label for="blob-points-input" class="block text-sm font-medium mb-1">Blob Points</label>
                    <input
                        id="blob-points-input"
                        type="number"
                        bind:value={blobPoints}
                        min="3"
                        max="20"
                        class="w-full px-2 py-1 border rounded"
                    />
                </div>
                
                <div>
                    <label for="min-radius-input" class="block text-sm font-medium mb-1">Min Radius Multiplier</label>
                    <input
                        id="min-radius-input"
                        type="number"
                        bind:value={minRadiusMultiplier}
                        min="0"
                        max="1"
                        step="0.01"
                        class="w-full px-2 py-1 border rounded"
                    />
                </div>
                
                <div>
                    <label for="max-radius-input" class="block text-sm font-medium mb-1">Max Radius Multiplier</label>
                    <input
                        id="max-radius-input"
                        type="number"
                        bind:value={maxRadiusMultiplier}
                        min="0"
                        max="1"
                        step="0.01"
                        class="w-full px-2 py-1 border rounded"
                    />
                </div>
                
                <div>
                    <label for="circle-radius-input" class="block text-sm font-medium mb-1">Mouse Detection Radius</label>
                    <input
                        id="circle-radius-input"
                        type="number"
                        bind:value={circleRadius}
                        min="0"
                        max="500"
                        class="w-full px-2 py-1 border rounded"
                    />
                </div>
                
                <div>
                    <label for="palette-select" class="block text-sm font-medium mb-1">Color Palette</label>
                    <select
                        id="palette-select"
                        bind:value={selectedPreset}
                        onchange={handlePaletteChange}
                        class="w-full px-2 py-1 border rounded bg-white"
                    >
                        <option value="sunset">Sunset</option>
                        <option value="ocean">Ocean</option>
                        <option value="forest">Forest</option>
                        <option value="neon">Neon</option>
                        <option value="monochrome">Monochrome</option>
                        <option value="candy">Candy</option>
                        <option value="earth">Earth</option>
                    </select>
                    <div class="flex gap-1 mt-2">
                        {#each activePalette as color, i (color + i)}
                            <div 
                                style="background: {color}" 
                                class="w-6 h-6 rounded border border-gray-300"
                            ></div>
                        {/each}
                    </div>
                    <button
                        onclick={handlePaletteChange}
                        class="mt-2 w-full px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                    >
                        Reset Colors
                    </button>
                </div>
                
                <div>
                    <label for="wave-color-input" class="block text-sm font-medium mb-1">Wave Pulse Color</label>
                    <input
                        id="wave-color-input"
                        type="color"
                        bind:value={nearColor}
                        class="w-full h-10 border rounded"
                    />
                </div>
                
                <div>
                    <label for="alpha-input" class="block text-sm font-medium mb-1">Alpha</label>
                    <input
                        id="alpha-input"
                        type="range"
                        bind:value={alpha}
                        min="0"
                        max="1"
                        step="0.01"
                        class="w-full"
                    />
                    <span class="text-xs text-gray-500">{alpha.toFixed(2)}</span>
                </div>
                
                <div>
                    <label for="wave-force-input" class="block text-sm font-medium mb-1">Wave Push Force</label>
                    <input
                        id="wave-force-input"
                        type="range"
                        bind:value={waveForce}
                        min="0"
                        max="8000"
                        step="100"
                        class="w-full"
                    />
                    <span class="text-xs text-gray-500">{waveForce}</span>
                </div>
                
                <div>
                    <label for="friction-input" class="block text-sm font-medium mb-1">Friction</label>
                    <input
                        id="friction-input"
                        type="range"
                        bind:value={friction}
                        min="0.9"
                        max="0.999"
                        step="0.001"
                        class="w-full"
                    />
                    <span class="text-xs text-gray-500">{friction.toFixed(3)}</span>
                </div>
                
                <div>
                    <label for="spring-force-input" class="block text-sm font-medium mb-1">Spring Force</label>
                    <input
                        id="spring-force-input"
                        type="range"
                        bind:value={springForce}
                        min="0"
                        max="0.05"
                        step="0.001"
                        class="w-full"
                    />
                    <span class="text-xs text-gray-500">{springForce.toFixed(3)}</span>
                </div>
                
                <div>
                    <label for="collision-bounce-input" class="block text-sm font-medium mb-1">Collision Bounce</label>
                    <input
                        id="collision-bounce-input"
                        type="range"
                        bind:value={collisionBounce}
                        min="0"
                        max="1.5"
                        step="0.05"
                        class="w-full"
                    />
                    <span class="text-xs text-gray-500">{collisionBounce.toFixed(2)}</span>
                </div>
                
                <div>
                    <label for="show-boxes-input" class="flex items-center gap-2">
                        <input
                            id="show-boxes-input"
                            type="checkbox"
                            bind:checked={showBoxes}
                            class="rounded"
                        />
                        <span class="text-sm font-medium">Show Grid</span>
                    </label>
                </div>
            </div>
        </div>
    {:else}
        <button
            onclick={() => showControls = true}
            class="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 hover:bg-white transition-colors"
            aria-label="Show controls"
        >
            ⚙️
        </button>
    {/if}
</div>

<svelte:window onresize={() => resizeCanvas()} />
<canvas
    bind:this={canvas}
    class="fixed top-0 left-0 bg-black"
    width="100%"
    height="100%"
    id="site-canvas"
></canvas>