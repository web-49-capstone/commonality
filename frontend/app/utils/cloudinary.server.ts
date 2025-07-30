import { v2 as cloudinaryUtils, type UploadStream, type UploadApiResponse } from 'cloudinary'
import { Readable } from 'stream'

cloudinaryUtils.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// Helper to convert Web ReadableStream to Node.js Readable
function webStreamToNodeReadable(webStream: ReadableStream<Uint8Array>): Readable {
    const reader = webStream.getReader()
    return new Readable({
        async read() {
            const { done, value } = await reader.read()
            if (done) {
                this.push(null)
            } else {
                this.push(Buffer.from(value))
            }
        }
    })
}

export async function uploadToCloudinary(webStream: ReadableStream<Uint8Array>): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream: UploadStream = cloudinaryUtils.uploader.upload_stream(
            { folder: 'commonality-avatars' },
            (error, result: UploadApiResponse | undefined) => {
                if (error || !result) {
                    console.error("Cloudinary upload failed", error)
                    return reject(error)
                }
                resolve(result.secure_url)
            }
        )

        // Convert and pipe to Cloudinary
        const nodeStream = webStreamToNodeReadable(webStream)
        nodeStream.pipe(uploadStream)
    })
}
