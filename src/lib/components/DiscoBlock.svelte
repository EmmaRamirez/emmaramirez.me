<script lang="ts">
	import { onMount } from 'svelte';
	import ImageBlock from './ImageBlock.svelte';

	interface ImageBlockProps {
		image: string;
		alt: string;
		caption: string;
		class: string;
	}

	let { image, alt, caption, class: className }: ImageBlockProps = $props();

    let animationId = $state(0);

    let canvas: HTMLCanvasElement | null = $state(null);
    let ctx: CanvasRenderingContext2D | null = $state(null);
    let canvasBounds: DOMRect | null = $state(null);
    let discoSquares = $state(36);
    let discoSquareSize = 10;


        onMount(() => {
            canvas = document.getElementById('canvas') as HTMLCanvasElement;
            ctx = canvas.getContext('2d');
            canvasBounds = canvas.getBoundingClientRect();
            const imageBlock = document.getElementById('image');
            const imageBlockBounds = imageBlock?.getBoundingClientRect();
            console.log('imageBlockBounds', imageBlockBounds);
            canvas.width = imageBlockBounds?.width || 0;
            canvas.height = imageBlockBounds?.height || 0;
            discoSquares = Math.floor(imageBlockBounds?.width / discoSquareSize) + 1;
            console.log('discoSquares', discoSquares);
        }); 

    function moveDisco(event: MouseEvent) {
        animationId = requestAnimationFrame(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            discoEffect({ clientX: event.clientX, clientY: event.clientY });
        });
    }

 
    function discoEffect({ clientX, clientY }: { clientX: number, clientY: number }) {
        console.log('canvasBounds', canvasBounds);
        console.log(clientX - canvasBounds.left, clientY - canvasBounds.top);
        let rands = [];

        for (let i = 0; i < discoSquares; i++) {
            for (let j = 0; j < discoSquares; j++) {
                const x = clientX - canvasBounds.left;
                const y = clientY - canvasBounds.top;
                const discoX = (j * discoSquareSize);
                const discoY =  (i * discoSquareSize);
                const noiseValue = Math.random() * 0.05;
                
                const absoluteDistanceX = Math.abs(discoX - x);
                const absoluteDistanceY = Math.abs(discoY - y);
                const distanceFromCenter = Math.sqrt(absoluteDistanceX * absoluteDistanceX + absoluteDistanceY * absoluteDistanceY);
                const rand = 1 - (distanceFromCenter / (discoSquares * discoSquareSize)) + noiseValue;

                rands.push(rand);

                ctx.beginPath();
                ctx.fillStyle = `rgba(${255 - (rand * 10)}, ${255 - (rand * 10)}, ${255 - (rand * 10)}, ${rand})`;
                ctx.fillRect(j * discoSquareSize, i * discoSquareSize, discoSquareSize, discoSquareSize);
                // ctx.fill();
            }
        }

        console.log(rands);
    }

    function stopDisco() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
    }
        
	
</script>

<ImageBlock {image} {alt} {caption} class={className} imageId="image" onmousemove={moveDisco} onmouseleave={stopDisco}>
    <canvas class="absolute top-0 left-0" id="canvas"></canvas>
</ImageBlock>


<style>
	

</style>
