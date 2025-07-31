export type ImageAsset = {
	id: string
	url: string
	alt?: string
	width?: number
	height?: number
	mimeType?: string
}

export type VideoAsset = {
	id: string
	url: string
	thumbnail?: ImageAsset
	duration?: number
}
