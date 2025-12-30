export const reroute = (request: { url: string }) => {
	return new URL(request.url).pathname;
};
