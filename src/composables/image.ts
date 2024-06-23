import type { YouTubePreviewData } from '../types/YouTubePreviewData.type'

export function getImageSrc(youtubePreview: YouTubePreviewData) {
    const thumbnailURL = import.meta.env.VITE_THUMBNAIL_URL

    if (youtubePreview.s3ObjectKey !== undefined) {
        return `${thumbnailURL}/${youtubePreview.s3ObjectKey}`
    } else if (youtubePreview.imageURL !== undefined) {
        return youtubePreview.imageURL
    }

    throw Error("No image to return")
}

export async function compressImage(imageBitmap: ImageBitmapSource): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;

    const context = canvas.getContext("2d");
    if (context === null) {
        throw new Error("Cannot get 2d context from canvas");
    }

    return createImageBitmap(imageBitmap).then(imageBitmap => {
        context.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, 0, 0, canvas.width, canvas.height)

        return new Promise(function (resolve, reject) {
            return canvas.toBlob(function (blob) {
                if (blob) {
                    resolve(blob)
                }
                else {
                    reject()
                }
            }, 'image/jpeg', .8)
        })
    })
}