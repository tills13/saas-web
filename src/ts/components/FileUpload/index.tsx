import "./index.scss"

import classnames from "classnames"
import React from "react"
import { compose, defaultProps, mapProps, SetStateCallback, withState } from "recompose"

import { isArray } from "lodash"
import { pluralize } from "utils"
import Upload from "./upload"

interface FileUploadInnerProps extends FileUploadOuterProps {
  dragActive: boolean
  draggedFiles: any
  limit: number
  setDragActive: SetStateCallback<boolean>
  setDraggedFiles: SetStateCallback<any>
  setFiles: SetStateCallback<any>
  files: File[]
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
  onUploadFile?: (file: File | Models.File) => void
  placeholder?: string
  uploadType: string
  value?: File | Models.File | (File | Models.File)[]
}

class FileUpload extends React.Component<FileUploadInnerProps, {}> {
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  inputRef: React.RefObject<HTMLInputElement> = React.createRef()
  dragTargets: any[] = []

  onUploadComplete = (uploadedFile: Models.File) => {
    const { multiple, onChange, onUploadFile, value } = this.props

    const mValue = multiple
      ? [ uploadedFile ].concat(value)
      : uploadedFile

    onUploadFile && onUploadFile(uploadedFile)
    onChange && onChange(mValue)
  }

  onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { setFiles } = this.props
    const files = event.target.files


    if (!files) return

    setFiles([ files.item(0) ])
  }

  onClick = () => {
    const input = this.inputRef.current

    if (!input) return

    input.click()
  }

  onDragEnter = (event: React.DragEvent<HTMLElement>) => {
    const { setDragActive, setDraggedFiles } = this.props

    event.preventDefault()

    if (this.dragTargets.indexOf(event.target) === -1) {
      this.dragTargets.push(event.target)
    }

    setDragActive(true)
    setDraggedFiles(this.getFiles(event))
  }

  onDragOver = (event: React.SyntheticEvent) => {
    event.preventDefault()
    event.stopPropagation()

    return false
  }

  onDragLeave = (event: React.SyntheticEvent) => {
    const { setDragActive } = this.props

    event.preventDefault()
    event.stopPropagation()

    this.dragTargets = this.dragTargets.filter((element) => {
      const container = this.containerRef.current
      return element !== event.target
        && container
        && container.contains(element)
    })

    if (this.dragTargets.length > 0) return

    setDragActive(false)
  }

  onDrop = (event: React.DragEvent<HTMLDivElement> | DragEvent | Event) => {
    const { files, limit, setDragActive, setDraggedFiles, setFiles } = this.props

    event.preventDefault()
    event.stopPropagation()

    setDragActive(false)
    setDraggedFiles(null)

    this.dragTargets = []

    let mFiles: any = (files || []).concat(this.getFiles(event))
    if (limit != null) mFiles = mFiles.slice(0, limit)

    setFiles(mFiles)
  }

  componentDidMount () {
    document.addEventListener("drop", this.onDrop, false)
    document.addEventListener("dropover", this.onDrop, false)
  }

  getFiles (event: React.DragEvent<any> | DragEvent | Event): any[] {
    if ((event as any).dataTransfer) {
      const dataTransfer = (event as any).dataTransfer

      if (dataTransfer.files && dataTransfer.files.length) {
        let dataTransferFileList = []

        for (let index = 0; index < dataTransfer.files.length; index++) {
          dataTransferFileList.push(dataTransfer.files[ index ])
        }

        return dataTransferFileList
      } else if (dataTransfer.items && dataTransfer.items.length) {
        let dataTransferItemsList = []

        for (let index = 0; index < dataTransfer.items.length; index++) {
          dataTransferItemsList.push(dataTransfer.items[ index ])
        }

        return dataTransferItemsList
      }
    }

    return []
  }

  renderFiles () {
    const { onChange, files, uploadType, setFiles, value } = this.props

    return files && files.map((mFile: File, index) => {
      const key = (mFile as any).id
        || mFile.name
        || `${ (mFile as any).name }${ (mFile as any).size }${ (mFile as any).type }`

      const onClickClear = (event: React.MouseEvent<any>) => {
        event.stopPropagation()
        event.preventDefault()

        files.splice(index, 1)
        setFiles(files)

        const mValue = isArray(value)
          ? value.filter(v => v.id === mFile.id)
          : null

        onChange(mValue)
      }

      return (
        <Upload
          key={ key }
          file={ mFile }
          uploadType={ uploadType }
          onClickClear={ onClickClear }
          onUploadComplete={ this.onUploadComplete }
        />
      )
    })
  }

  renderInput () {
    const { id, multiple } = this.props

    return (
      <input
        id={ id }
        ref={ this.inputRef }
        type="file"
        multiple={ multiple }
        onChange={ this.onChangeInput }
      />
    )
  }

  renderLabel () {
    const { id, label, name } = this.props

    return label && (
      <label className="FileUpload__label" htmlFor={ id || name }>
        { label }
      </label>
    )
  }

  renderMessage () {
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

  render () {
    const { className, containerClassName, dragActive, files, limit } = this.props

    const mContainerClassName = classnames("FileUpload__container", containerClassName)
    const mClassName = classnames("FileUpload", className, {
      "--empty": !files || files.length === 0,
      "--full": files && files.length >= limit,
      "--dragActive": dragActive
    })

    return (
      <div
        className={ mContainerClassName }
        onClick={ this.onClick }
        onDragEnter={ this.onDragEnter }
        onDragOver={ this.onDragOver }
        onDragLeave={ this.onDragLeave }
        onDrop={ this.onDrop }
        ref={ this.containerRef }
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

export default compose<FileUploadInnerProps, FileUploadOuterProps>(
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
    return (!value || isArray(value)) ? value : [ value ]
  })
)(FileUpload)
