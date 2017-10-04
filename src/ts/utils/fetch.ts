import "whatwg-fetch"

import { Map } from "immutable"
import * as Relay from "react-relay/classic"

import {
  InitializeFileMutation,
  PublishFileMutation
} from "relay/mutations"

declare var __API_ROOT__: string
const BASE_URL = `${ location.origin }/api` || __API_ROOT__

export interface FetchOptions {
  includeCredentials?: boolean
  overrideBaseUrl?: boolean
}

export const defaultFetchOptions: FetchOptions = {
  includeCredentials: true,
  overrideBaseUrl: false
}

export function fetchWithProgress(
  url: string,
  opts: any = {},
  onProgress: (loaded: number, total: number) => void
) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(opts.method || "GET", url)

    for (let header in opts.headers || {}) {
      xhr.setRequestHeader(header, opts.headers[header])
    }

    xhr.onload = (event) => resolve((<any>event.target).responseText)
    xhr.onerror = reject

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = ({ loaded, total }) => onProgress(loaded, total)
    }

    xhr.send(opts.body)
  })
}

export function uploadFile(
  data: File,
  uploadType: string,
  trackProgress: (loaded: number, total: number) => void
) {
  return new Promise((resolve, reject) => {
    const payload = {
      contentType: data.type,
      fileName: data.name,
      uploadType
    }

    Relay.Store.commitUpdate(new InitializeFileMutation(payload), {
      onFailure: (err) => reject(err),
      onSuccess: ({ initializeFileMutation }) => {
        const { file, uploadUrl } = initializeFileMutation
        const payload = { method: "PUT", body: data }

        return fetchWithProgress(uploadUrl, payload, trackProgress).then(() => {
          Relay.Store.commitUpdate(new PublishFileMutation({ fileId: file.id }), {
            onFailure: (err) => reject(err),
            onSuccess: ({ publishFileMutation: { publishedFile } }) => {
              return resolve(publishedFile)
            }
          })
        })
      }
    })
  })
}


export const http = {
  _handleResponse: (response: Response): Promise<any> => {
    if (response.status >= 400) {
      return response.json().then((json) => {
        return Promise.reject(json)
      }).catch((err) => {
        return Promise.reject({ ...err, code: response.status })
      })
    }

    return response.json().catch(() => { return {} })
  },

  _handleError: (err: string): Promise<any> => {
    return Promise.reject(err)
  },

  get: (url: string, params: any = {}): Promise<any> => {
    const query = Object.keys(params)
      .map((key, index) => `${ encodeURIComponent(key) }=${ encodeURIComponent(params[key]) }`)
      .join("&")

    return fetch(`${ BASE_URL }${ url }${ query.length > 0 ? `?${ query }` : "" }`, {
      method: "GET",
      credentials: "include"
    })
      .then(http._handleResponse)
      .catch(http._handleError)
  },

  post: (url: string, data: {} = {}, options: FetchOptions = defaultFetchOptions): Promise<any> => {
    return fetch(`${ !options.overrideBaseUrl ? BASE_URL : "" }${ url }`, {
      method: "POST",
      credentials: options.includeCredentials ? "include" : null,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(http._handleResponse)
      .catch(http._handleError)
  },

  put: (url: string, data: {} = {}): Promise<any> => {
    return fetch(`${ BASE_URL }${ url }`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(http._handleResponse)
      .catch(http._handleError)
  },

  multipart: (url: string, data: any = {}): Promise<any> => {
    let mData = new FormData()

    Map<any, any>(data).map((value, key) => {
      if (value instanceof FileList && (<FileList>value).length > 0) {
        mData.append(key, value[0])
      } else mData.append(key, value)
    })

    return fetch(`${ BASE_URL }${ url }`, {
      method: "POST",
      credentials: "include",
      body: mData
    })
      .then(http._handleResponse)
      .catch(http._handleError)
  }
}
