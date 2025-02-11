import { extractParentFromKey } from '@remix-ui/helper'
import React, { useContext, useRef, useState } from 'react'
import { MoveContext } from './context/moveContext'
import { DraggableType, DragType } from './types'

export const Drag = (props: DragType) => {
  const [dragged, setDragged] = useState<{path: string; isDirectory: boolean}>({} as {path: string; isDirectory: boolean})

  return (
    <MoveContext.Provider
      value={{
        dragged: dragged,
        moveFile: props.onFileMoved,
        moveFolder: props.onFolderMoved,
        currentlyMoved: (path) => {
          setDragged(() => path)
        },
        dragStatus: props.dragStatus
      }}
    >
      {props.children}
    </MoveContext.Provider>
  )
}

export const Draggable = (props: DraggableType) => {
  const dragRef = useRef<HTMLSpanElement>(null),
    destination = props.file,
    context = useContext(MoveContext)

  // delay timer
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  // folder to open
  const [folderToOpen, setFolderToOpen] = useState<string>()

  const handleDrop = (event: React.DragEvent<HTMLSpanElement>) => {
    event.preventDefault()

    if (destination.isDirectory) {
      if (context.dragged.isDirectory) {
        context.moveFolder(destination.path, context.dragged.path)
      } else {
        context.moveFile(destination.path, context.dragged.path)
      }
    } else {
      const path = extractParentFromKey(destination.path) || '/'

      if (context.dragged.isDirectory) {
        context.moveFolder(path, context.dragged.path)
      } else {
        context.moveFile(path, context.dragged.path)
      }
    }
  }

  const handleDragover = (event: React.DragEvent<HTMLSpanElement>) => {
    //Checks if the folder is opened
    event.preventDefault()
    if (destination.isDirectory && !props.expandedPath.includes(destination.path) && folderToOpen !== destination.path && props.handleClickFolder) {
      setFolderToOpen(destination.path)
      timer && clearTimeout(timer)
      setTimer(
        setTimeout(() => {
          props.handleClickFolder(destination.path, destination.type)
          setFolderToOpen(null)
        }, 600)
      )
    }
  }

  const handleDrag = () => {
    context.dragStatus(true)
    if (context.dragged.path !== destination.path) {
      context.currentlyMoved({
        path: destination.path,
        isDirectory: destination.isDirectory
      })
    }
  }

  const handleDragEnd = () => {
    context.dragStatus(false)
  }

  return (
    <>
      {props.isDraggable ? (
        props.children
      ) : (
        <span
          ref={dragRef}
          draggable
          onDrop={(event) => {
            handleDrop(event)
          }}
          onDragStart={(event) => {
            if (destination && destination.path === '/'){
              event.preventDefault()
              event.stopPropagation
            } else

            if (destination) {
              handleDrag()
            }
          }}
          onDragEnd={(event) => {
            handleDragEnd()
          }}
          onDragOver={(event) => {
            if (destination) {
              handleDragover(event)
            }
          }}
        >
          {props.children}
        </span>
      )}
    </>
  )
}
