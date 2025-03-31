export function calculateReadingTime(text: string): string {
	const baseWordsPerMinute = 200

	const cleanText = text.replace(/```[\s\S]*?```/g, '')
	const words = cleanText.trim().split(/\s+/).length

	const codeBlockMatches = text.match(/```[\s\S]*?```/g) || []
	const codeWords = codeBlockMatches.reduce((acc, block) => {
		return acc + block.trim().split(/\s+/).length
	}, 0)

	const regularTextTime = words / baseWordsPerMinute
	const codeReadingTime = codeWords / (baseWordsPerMinute * 0.5) // code is read slower

	// about 15 seconds to process an image
	const imageCount = (text.match(/!\[.*?\]\(.*?\)/g) || []).length
	const imageTime = (imageCount * 15) / 60

	const totalMinutes = Math.ceil(regularTextTime + codeReadingTime + imageTime)

	return totalMinutes === 1 ? '1 min read' : `${totalMinutes} min read`
}
