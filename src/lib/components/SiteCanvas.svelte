<script lang="ts">
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement | null = null;

    let columns = $state(100);
    let rows = $state(100);
    let mouseX = $state(0);
    let mouseY = $state(0);
    
    // Editable blob parameters
    let blobPoints = $state(8);
    let minRadiusMultiplier = $state(0.19);
    let maxRadiusMultiplier = $state(0.36);
    let circleRadius = $state(100);
    let nearColor = $state('red');
    let farColor = $state('blue');
    let alpha = $state(0.7);
    let showBoxes = $state(true);
    let showControls = $state(true);

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
    let blobPointsCache = $state<{ points: { x: number; y: number }[]; quadrant: { x: number, y: number, width: number, height: number } }[]>([]);
    
    // Wave pulse animation state
    interface WavePulse {
        x: number;
        y: number;
        startTime: number;
        maxRadius: number;
        duration: number;
    }
    let wavePulses = $state<WavePulse[]>([]);
    const pulseMaxRadius = 500;
    const pulseDuration = 1000; // milliseconds

    function regenerateCanvas() {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                boxes = setBoxes(canvas);
                // Regenerate blob points
                blobPointsCache = boxes.map(quadrant => ({
                    points: generateBlobPoints(quadrant),
                    quadrant
                }));
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                createboxes(ctx, canvas, boxes);
                blobPointsCache.forEach(({ points, quadrant }) => {
                    generateBlob(ctx, canvas!, quadrant, points);
                });
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
            ctx.strokeStyle = 'blue';
            boxes.forEach(quadrant => {
                ctx.strokeRect(quadrant.x, quadrant.y, quadrant.width, quadrant.height);
            });
        }
    }

    function generateBlobPoints(
        quadrant: { x: number, y: number, width: number, height: number }
    ): { x: number; y: number }[] {
        // Blob params
        const centerX = quadrant.x + quadrant.width / 2;
        const centerY = quadrant.y + quadrant.height / 2;
        const minRadius = Math.min(quadrant.width, quadrant.height) * minRadiusMultiplier;
        const maxRadius = Math.min(quadrant.width, quadrant.height) * maxRadiusMultiplier;

        // Generate random radii for blob shape
        const radii = Array.from({ length: blobPoints }, () =>
            minRadius + Math.random() * (maxRadius - minRadius)
        );

        // Generate blob points
        const blobPointsArray: { x: number; y: number }[] = [];
        for (let i = 0; i < blobPoints; i++) {
            const angle = ((Math.PI * 2) / blobPoints) * i;
            const radius = radii[i];
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            blobPointsArray.push({ x, y });
        }

        return blobPointsArray;
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

    function drawBlob(
        ctx: CanvasRenderingContext2D,
        blobData: { points: { x: number; y: number }[]; isNearMouse: boolean }
    ) {
        ctx.save();
        ctx.beginPath();
        blobData.points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.closePath();
        ctx.fillStyle = blobData.isNearMouse ? nearColor : farColor;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    function generateBlob(
        ctx: CanvasRenderingContext2D | null, 
        canvas: HTMLCanvasElement, 
        quadrant: { x: number, y: number, width: number, height: number },
        blobPoints: { x: number; y: number }[]
    ) {
        if (ctx) {
            const isNearMouse = checkIsNearMouse(quadrant);
            drawBlob(ctx, { points: blobPoints, isNearMouse });
        }
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
        blobPointsCache.forEach(({ points, quadrant }) => {
            generateBlob(ctx, canvas!, quadrant, points);
        });
        drawWavePulses(ctx);
    }

    function generateBlobs(event: MouseEvent, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        renderCanvas();
    }
    
    function handleClick(event: MouseEvent) {
        // Create a new wave pulse at the click position
        wavePulses = [...wavePulses, {
            x: event.clientX,
            y: event.clientY,
            startTime: Date.now(),
            maxRadius: pulseMaxRadius,
            duration: pulseDuration
        }];
        
        renderCanvas();
    }
    
    function animationLoop() {
        if (wavePulses.length > 0) {
            renderCanvas();
            requestAnimationFrame(animationLoop);
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
        const ctx = canvas?.getContext('2d') || null;
        if (canvas && ctx) {
            regenerateCanvas();
        }
        

        const onMouseMove = (event: MouseEvent) => {
            window.requestAnimationFrame(() => {
                generateBlobs(event, ctx, canvas!);
            });
        };
        
        const onClick = (event: MouseEvent) => {
            handleClick(event);
            // Start animation loop if not already running
            if (wavePulses.length === 1) {
                animationLoop();
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
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
                    <label for="near-color-input" class="block text-sm font-medium mb-1">Near Color</label>
                    <input
                        id="near-color-input"
                        type="color"
                        bind:value={nearColor}
                        class="w-full h-10 border rounded"
                    />
                </div>
                
                <div>
                    <label for="far-color-input" class="block text-sm font-medium mb-1">Far Color</label>
                    <input
                        id="far-color-input"
                        type="color"
                        bind:value={farColor}
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