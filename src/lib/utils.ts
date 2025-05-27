import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Point } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseSVGPath(pathString: string) {
	const points: Point[] = [];
	
	// Parse the path string
	const commands = pathString.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
	
	let currentX = 0;
	let currentY = 0;
	
	commands.forEach(command => {
	  const type = command[0];
	  const coords = command.slice(1).trim().split(/[\s,]+/).map(Number);
	  
	  switch (type) {
		case 'M': // MoveTo
		  currentX = coords[0];
		  currentY = coords[1];
		  points.push({
			x: currentX,
			y: currentY,
			originX: currentX,
			originY: currentY,
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  break;
		  
		case 'C': // Cubic Bézier curve
		  // For cubic Bézier, we have: x1,y1 x2,y2 x,y
		  // Add all three points: two control points and the end point
		  
		  // First control point
		  points.push({
			x: coords[0],
			y: coords[1],
			originX: coords[0],
			originY: coords[1],
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  
		  // Second control point
		  points.push({
			x: coords[2],
			y: coords[3],
			originX: coords[2],
			originY: coords[3],
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  
		  // End point
		  currentX = coords[4];
		  currentY = coords[5];
		  points.push({
			x: currentX,
			y: currentY,
			originX: currentX,
			originY: currentY,
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  break;
		  
		case 'Z': // Close path
		  // The Z command closes the path back to the start
		  break;
	  }
	});
	
	return points;
  }

  export function parseDataPoints(pathString: string) {
	const points: Point[] = [];
	const commands = pathString.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
	
	commands.forEach(command => {
	  const type = command[0];
	  const coords = command.slice(1).trim().split(/[\s,]+/).map(Number);
	  
	  switch (type) {
		case 'M': // MoveTo - this is a data point
		  points.push({
			x: coords[0],
			y: coords[1],
			originX: coords[0],
			originY: coords[1],
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  break;
		  
		case 'C': // Cubic Bézier curve - only the end point is a data point
		  points.push({
			x: coords[4],
			y: coords[5],
			originX: coords[4],
			originY: coords[5],
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  break;
	  }
	});
	
	return points;
  }