import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Point } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a date as a human-readable relative time string
 * Shows relative time for recent dates ("2 days ago", "last week")
 * and absolute dates for older content ("December 30, 2024")
 */
export function formatRelativeDate(dateStr: string | undefined): string {
	if (!dateStr) return '';
	
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	
	if (diffDays < 0) {
		return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}
	
	if (diffDays === 0) {
		return 'today';
	}
	
	if (diffDays === 1) {
		return 'yesterday';
	}
	
	if (diffDays < 7) {
		return `${diffDays} days ago`;
	}
	
	if (diffDays < 14) {
		return 'last week';
	}
	
	if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} weeks ago`;
	}
	
	if (diffDays < 60) {
		return 'last month';
	}
	
	if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return `${months} months ago`;
	}
	
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Format date as short relative or absolute
 * For use in compact displays (e.g., article list)
 */
export function formatShortDate(dateStr: string | undefined): string {
	if (!dateStr) return '';
	
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	
	if (diffDays < 0) {
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
	
	if (diffDays === 0) return 'today';
	if (diffDays === 1) return 'yesterday';
	if (diffDays < 7) return `${diffDays}d ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
	
	const sameYear = date.getFullYear() === now.getFullYear();
	return date.toLocaleDateString('en-US', { 
		month: 'short', 
		day: 'numeric',
		...(sameYear ? {} : { year: 'numeric' })
	});
}

export function parseSVGPath(pathString: string) {
	const points: Point[] = [];
	
	const commands = pathString.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
	
	let currentX = 0;
	let currentY = 0;
	
	if (!commands) return points;
	
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
		  
		case 'C':
		  points.push({
			x: coords[0],
			y: coords[1],
			originX: coords[0],
			originY: coords[1],
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  
		  points.push({
			x: coords[2],
			y: coords[3],
			originX: coords[2],
			originY: coords[3],
			noiseOffsetX: 0,
			noiseOffsetY: 0
		  });
		  
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
		  
		case 'Z':
		  break;
	  }
	});
	
	return points;
  }

  export function parseDataPoints(pathString: string) {
	const points: Point[] = [];
	const commands = pathString.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
	
	if (!commands) return points;
	
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