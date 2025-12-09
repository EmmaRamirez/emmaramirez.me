// Paraglide reroute - disabled since paraglide runtime is not available
// This hook is kept for future paraglide setup but currently just returns the original pathname
export const reroute = (request: { url: string }) => {
	// Return the original pathname since paraglide is not set up
	return new URL(request.url).pathname;
};
