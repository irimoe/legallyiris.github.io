export const buildInfo = {
	commitHash: import.meta.env.VITE_COMMIT_HASH || 'development',
	buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
}
