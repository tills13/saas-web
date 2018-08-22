import { initializeFile, publishFile } from "relay/mutations"

type UploadProgressCallback = (loaded: number, total: number) => void

export function fetchWithProgress (url: string, opts: any = {}, onProgress: UploadProgressCallback) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(opts.method || "GET", url)

    for (let header in opts.headers || {}) {
      xhr.setRequestHeader(header, opts.headers[ header ])
    }

    xhr.onload = (event) => resolve((<any> event.target).responseText)
    xhr.onerror = reject

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = ({ loaded, total }) => onProgress(loaded, total)
    }

    xhr.send(opts.body)
  })
}

export function uploadFile (data: File, uploadType: string, trackProgress: UploadProgressCallback) {
  return initializeFile({ contentType: data.type, fileName: data.name, uploadType }).then(response => {
    const { initializeFileMutation } = response
    const { file, uploadUrl } = initializeFileMutation

    return fetchWithProgress(uploadUrl, { method: "PUT", body: data }, trackProgress).then(_ => {
      return publishFile({ fileId: file.id })
        .then(mResponse => mResponse.publishFileMutation.publishedFile)
    })
  })
}
