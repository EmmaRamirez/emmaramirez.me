<script lang="ts">
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement | null = null;

    let columns = $state(100);
    let rows = $state(100);
    let mouseX = $state(0);
    let mouseY = $state(0);

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

    function resizeCanvas(cvs?: HTMLCanvasElement) {
        const target = cvs || canvas;
        if (target) {
            target.width = window.innerWidth;
            target.height = window.innerHeight;
            const ctx = target.getContext('2d');
            if (ctx) {
                boxes = setBoxes(target);
                // Regenerate blob points when canvas is resized
                blobPointsCache = boxes.map(quadrant => ({
                    points: generateBlobPoints(quadrant),
                    quadrant
                }));
                ctx.clearRect(0, 0, target.width, target.height);
                createboxes(ctx, target, boxes);
                blobPointsCache.forEach(({ points, quadrant }) => {
                    generateBlob(ctx, target, quadrant, points);
                });
            }
        }
    }

    function createboxes(
        ctx: CanvasRenderingContext2D | null, 
        canvas: HTMLCanvasElement, 
        boxes: { x: number, y: number, width: number, height: number }[]
    ) {
        if (ctx) {
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
        const points = 8;
        const centerX = quadrant.x + quadrant.width / 2;
        const centerY = quadrant.y + quadrant.height / 2;
        const minRadius = Math.min(quadrant.width, quadrant.height) * 0.19;
        const maxRadius = Math.min(quadrant.width, quadrant.height) * 0.36;

        // Generate random radii for blob shape
        const radii = Array.from({ length: points }, () =>
            minRadius + Math.random() * (maxRadius - minRadius)
        );

        // Generate blob points
        const blobPoints: { x: number; y: number }[] = [];
        for (let i = 0; i < points; i++) {
            const angle = ((Math.PI * 2) / points) * i;
            const radius = radii[i];
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            blobPoints.push({ x, y });
        }

        return blobPoints;
    }

    function checkIsNearMouse(
        quadrant: { x: number, y: number, width: number, height: number }
    ): boolean {
        // Generate radial coordinates for a circle of radius 100 (diameter 200) centered at the mouse position
        const circlePoints = 32;
        const circleRadius = 100;
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
        ctx.fillStyle = blobData.isNearMouse ? 'red' : 'blue';
        ctx.globalAlpha = 0.7;
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

    function generateBlobs(event: MouseEvent, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        console.log(mouseX, mouseY);

        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            createboxes(ctx, canvas, boxes);
            blobPointsCache.forEach(({ points, quadrant }) => {
                generateBlob(ctx, canvas!, quadrant, points);
            });
        }
    }

    onMount(() => {
        canvas = document.getElementById('site-canvas') as HTMLCanvasElement;
        resizeCanvas();
        const ctx = canvas?.getContext('2d') || null;
        if (canvas && ctx) {
            boxes = setBoxes(canvas);
            // Generate blob points once and cache them
            blobPointsCache = boxes.map(quadrant => ({
                points: generateBlobPoints(quadrant),
                quadrant
            }));
            createboxes(ctx, canvas, boxes);
            blobPointsCache.forEach(({ points, quadrant }) => {
                generateBlob(ctx, canvas!, quadrant, points);
            });
        }
        

        const onMouseMove = (event: MouseEvent) => {
            window.requestAnimationFrame(() => {
                generateBlobs(event, ctx, canvas!);
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    });

</script>

<window onresize={() => resizeCanvas()}></window>
<canvas
    bind:this={canvas}
    class="fixed top-0 left-0"
    width="100%"
    height="100%"
    id="site-canvas"
></canvas>