import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import { compose, defaultProps, mapProps, SetStateCallback, withState } from "recompose"

import { isArray } from "lodash"
import { pluralize } from "utils"
import Upload from "./upload"

interface FileUploadInnerProps extends FileUploadOuterProps {
  dragActive: boolean
  draggedFiles: any
  setDragActive: SetStateCallback<boolean>
  setDraggedFiles: SetStateCallback<any>
  setFiles: SetStateCallback<any>
  files: any[]
}

interface FileUploadOuterProps extends React.Props<any> {
  className?: string
  containerClassName?: string
  id?: string
  label?: string
  limit?: number
  meta?: any
  multiple?: boolean
  name?: string
  onChange?: any
  onUploadFile?: (file: UploadFile) => void
  placeholder?: string
  uploadType: string
  value?: any
}

type UploadFile = File | Models.FileInterface

class FileUpload extends React.Component<FileUploadInnerProps, {}> {
  container: HTMLElement
  input: HTMLInputElement
  dragTargets: any[] = []

  onUploadComplete = (uploadedFile: Models.FileInterface) => {
    const { multiple, onChange, onUploadFile, value } = this.props

    const mValue = multiple
      ? [uploadedFile].concat(value)
      : uploadedFile

    console.log(mValue, uploadedFile)

    onUploadFile && onUploadFile(uploadedFile)
    onChange && onChange(mValue)
  }

  onDragEnter = (event: React.DragEvent<HTMLElement>) => {
    const { setDragActive, setDraggedFiles } = this.props

    event.preventDefault()

    if (this.dragTargets.indexOf(event.target) === -1) {
      this.dragTargets.push(event.target)
    }

    setDragActive(true)
    setDraggedFiles(this.getDataTransferFiles(event))
  }

  onDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()

    return false
  }

  onDragLeave = (event) => {
    const { setDragActive } = this.props

    event.preventDefault()
    event.stopPropagation()

    this.dragTargets = this.dragTargets.filter((element) => {
      return element !== event.target && this.container.contains(element)
    })

    if (this.dragTargets.length > 0) return

    setDragActive(false)
  }

  onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const { files, limit, setDragActive, setDraggedFiles, setFiles } = this.props

    event.preventDefault()
    event.stopPropagation()

    setDragActive(false)
    setDraggedFiles(null)

    this.dragTargets = []

    let mFiles = this.getDataTransferFiles(event)
    mFiles = (files || []).concat(mFiles)
    if (limit != null) mFiles = mFiles.slice(0, limit)

    setFiles(mFiles)
  }

  componentDidMount() {
    // document.addEventListener("drop", this.onDrop, false)
    // document.addEventListener("dropover", this.onDrop, false)
  }

  getDataTransferFiles(event: React.DragEvent<any>): (File | DataTransferItem)[] {
    if (event.dataTransfer) {
      const dataTransfer = event.dataTransfer

      if (dataTransfer.files && dataTransfer.files.length) {
        let dataTransferFileList = []

        for (let index = 0; index < dataTransfer.files.length; index++) {
          dataTransferFileList.push(dataTransfer.files[index])
        }

        return dataTransferFileList
      } else if (dataTransfer.items && dataTransfer.items.length) {
        let dataTransferItemsList = []

        for (let index = 0; index < dataTransfer.items.length; index++) {
          dataTransferItemsList.push(dataTransfer.items[index])
        }

        return dataTransferItemsList
      }
    }

    return []
  }

  renderFiles() {
    const { files, uploadType } = this.props

    return files && files.map((mFile: UploadFile, index) => {
      const key = mFile instanceof File
        ? `${ mFile.name }${ mFile.size }${ mFile.type }`
        : mFile.id

      return (
        <Upload
          key={ key }
          file={ mFile }
          uploadType={ uploadType }
          onUploadComplete={ this.onUploadComplete }
          clearUpload={ () => files.splice(index, 1) }
        />
      )
    })
  }

  renderInput() {
    const { id, multiple, setFiles } = this.props

    const onChange = (event) => {
      setFiles([event.target.files[0]])
    }

    return (
      <input
        id={ id }
        ref={ (input) => this.input = input }
        type="file"
        multiple={ multiple }
        onChange={ onChange }
      />
    )
  }

  renderLabel() {
    const { id, label, name } = this.props

    return label && (
      <label className="FileUpload__label" htmlFor={ id || name }>
        { label }
      </label>
    )
  }

  renderMessage() {
    const { dragActive, draggedFiles, files, limit } = this.props

    return (!files || files.length < limit) && (
      <div className="FileUpload__emptyContent">
        { draggedFiles && dragActive
          ? `Attach ${ draggedFiles.length } ${ pluralize("file", draggedFiles.length) }`
          : "Click or drop files here"
        }
      </div>
    )
  }

  render() {
    const {
      className, containerClassName, dragActive, draggedFiles, id, files, label, limit,
      meta, multiple, name, onChange, setDragActive, setDraggedFiles, setFiles, uploadType,
      value, ...rest
    } = this.props

    const mContainerClassName = classnames("FileUpload__container", containerClassName)
    const mClassName = classnames("FileUpload", className, {
      "FileUpload--empty": !files || files.length === 0,
      "FileUpload--full": files && files.length >= limit,
      "FileUpload--dragActive": dragActive
    })

    return (
      <div
        className={ mContainerClassName }
        onClick={ () => this.input && this.input.click() }
        onDragEnter={ this.onDragEnter }
        onDragOver={ this.onDragOver }
        onDragLeave={ this.onDragLeave }
        onDrop={ this.onDrop }
        ref={ (container) => this.container = container }
      >
        { this.renderLabel() }
        <div className={ mClassName }>
          { this.renderFiles() }
          { this.renderMessage() }
          { this.renderInput() }
        </div>
      </div>
    )
  }
}

export default compose<any, any>(
  defaultProps({ multiple: false }),
  mapProps(({ input, label, limit, multiple, placeholder, value, ...rest }) => {
    const mValue = input ? input.value : value
    const mMultiple = multiple || (limit != null && limit > 1)
    const lValue = mValue == null ? (mMultiple ? [] : null) : mValue

    return {
      ...input,
      ...rest,
      label: label || placeholder,
      limit: limit != null ? limit : (multiple ? 4 : 1),
      multiple: mMultiple,
      value: lValue
    }
  }),
  withState("dragActive", "setDragActive", false),
  withState("draggedFiles", "setDraggedFiles", false),
  withState("files", "setFiles", ({ multiple, value }) => {
    return (!value || isArray(value)) ? value : [value]
  })
)(FileUpload)
