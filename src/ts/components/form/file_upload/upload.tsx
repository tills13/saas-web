import "./upload.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose, SetStateCallback, withState } from "recompose"

import Icon from "components/icon"
import ProgressBar from "components/progress_bar"

import { uploadFile } from "utils/fetch"

type UploadFile = File | Models.FileInterface

interface UploadInnerProps extends UploadOuterProps {
  error: boolean
  setError: SetStateCallback<boolean>
  setSuccess: SetStateCallback<boolean>
  setUploadProgress: SetStateCallback<{ loaded: number, total: number }>
  success: boolean
  uploadProgress: { loaded: number, total: number }
}

interface UploadOuterProps extends React.Props<any> {
  className?: string
  onClickClear: React.MouseEventHandler<any>
  file: UploadFile
  onUploadStart?: (file: UploadFile) => void
  onUploadProgress?: (file: UploadFile, loaded: number, total: number) => void
  onUploadComplete?: (file: UploadFile) => void
  uploadType: string
}

class Upload extends React.Component<UploadInnerProps, {}> {
  componentDidMount () {
    const { file, setError, setSuccess, uploadType } = this.props

    if (file instanceof File) {
      this.onUploadStart().then(() => {
        return uploadFile(file, uploadType, this.onUploadProgress)
      }).then((uploadedFile) => {
        setSuccess(true)
        return this.onUploadComplete(uploadedFile)
      }).catch((err) => {
        setError(true)
      })
    }
  }

  onUploadComplete = (uploadedFile) => {
    const { onUploadComplete } = this.props

    return new Promise((resolve) => {
      if (onUploadComplete) onUploadComplete(uploadedFile)
      resolve()
    })
  }

  onUploadProgress = (loaded: number, total: number) => {
    const { file, onUploadProgress, setUploadProgress } = this.props

    if (onUploadProgress) onUploadProgress(file, loaded, total)
    setUploadProgress({ loaded, total })
  }

  onUploadStart = () => {
    const { file, onUploadStart } = this.props

    return new Promise((resolve) => {
      if (onUploadStart) onUploadStart(file)
      resolve()
    })
  }

  renderPreview () {
    const { file } = this.props

    console.log(file)

    const filePreview = (file as Models.FileInterface).url
      ? (file as Models.FileInterface).url
      : URL.createObjectURL(file)

    return <img className="Upload__preview" src={ filePreview } />
  }

  renderUploadProgress () {
    const { error, success, uploadProgress } = this.props

    if (success) {
      return <Icon className="Upload__icon--success" icon="check" />
    } else if (error) {
      return <Icon className="Upload__icon--error" icon="times" />
    }

    return uploadProgress != null && (
      <div className="Upload__progress">
        <ProgressBar
          containerClassName="Upload__progressBar"
          progress={ uploadProgress.loaded }
          total={ uploadProgress.total }
          small
        />
      </div>
    )
  }

  render () {
    const { className, onClickClear, file } = this.props
    const mClassName = classnames("Upload", className)

    return (
      <div className={ mClassName }>
        { this.renderPreview() }
        <div className="Upload__fileName">{ file.name }</div>
        { this.renderUploadProgress() }
        <Icon
          containerClassName="Upload__cancelClear"
          icon="times"
          onClick={ onClickClear }
        />
      </div>
    )
  }
}

export default compose<UploadInnerProps, UploadOuterProps>(
  withState("error", "setError", false),
  withState("success", "setSuccess", false),
  withState("uploadProgress", "setUploadProgress", null)
)(Upload)
