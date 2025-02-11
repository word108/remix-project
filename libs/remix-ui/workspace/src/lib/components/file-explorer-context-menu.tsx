import React, {useRef, useEffect, useState, useContext} from 'react' // eslint-disable-line
import { useIntl } from 'react-intl'
import { action, FileExplorerContextMenuProps } from '../types'

import '../css/file-explorer-context-menu.css'
import { customAction } from '@remixproject/plugin-api'
import UploadFile from './upload-file'
import { appPlatformTypes, platformContext } from '@remix-ui/app'

declare global {
  interface Window {
    _paq: any
  }
}
const _paq = (window._paq = window._paq || []) //eslint-disable-line

export const FileExplorerContextMenu = (props: FileExplorerContextMenuProps) => {
  const platform = useContext(platformContext)
  const {
    actions,
    createNewFile,
    createNewFolder,
    deletePath,
    renamePath,
    hideContextMenu,
    pushChangesToGist,
    publishFileToGist,
    publishFolderToGist,
    copy,
    copyFileName,
    copyShareURL,
    copyPath,
    paste,
    runScript,
    emit,
    pageX,
    pageY,
    path,
    type,
    focus,
    downloadPath,
    uploadFile,
    publishManyFilesToGist,
    signTypedData,
    ...otherProps
  } = props
  const contextMenuRef = useRef(null)
  const intl = useIntl()
  const [showFileExplorer, setShowFileExplorer] = useState(false)

  useEffect(() => {
    contextMenuRef.current.focus()
  }, [])

  useEffect(() => {
    const menuItemsContainer = contextMenuRef.current
    const boundary = menuItemsContainer.getBoundingClientRect()

    if (boundary.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      menuItemsContainer.style.position = 'fixed'
      menuItemsContainer.style.bottom = '10px'
      menuItemsContainer.style.top = null
    }
  }, [pageX, pageY])

  const filterItem = (item: action) => {
    /**
     * if there are multiple elements focused we need to take this and all conditions must be met
     * for example : 'downloadAsZip' with type ['file','folder'] will work on files and folders when multiple are selected
     **/
    const nonRootFocus = focus.filter((el) => {
      return !(el.key === '' && el.type === 'folder')
    })

    if (focus?.length && focus[0].key === 'contextMenu') {
      return true
    }

    if (nonRootFocus.length > 1) {
      for (const element of nonRootFocus) {
        if (!itemMatchesCondition(item, element.type, element.key)) return false
      }
      return true
    } else {
      return itemMatchesCondition(item, type, path)
    }
  }

  const itemMatchesCondition = (item: action, itemType: string, itemPath: string) => {
    if ( platform === appPlatformTypes.desktop && item.platform && item.platform === appPlatformTypes.web) return false
    else if (item.type && Array.isArray(item.type) && (item.type.findIndex(name => name === itemType) !== -1)) return true
    else if (item.path && Array.isArray(item.path) && (item.path.findIndex(key => key === itemPath) !== -1)) return true
    else if (item.extension && Array.isArray(item.extension) && (item.extension.findIndex(ext => itemPath.endsWith(ext)) !== -1)) return true
    else if (item.pattern && Array.isArray(item.pattern) && (item.pattern.filter(value => itemPath.match(new RegExp(value))).length > 0)) return true
    else return false
  }

  const getPath = () => {
    if (focus.length > 1) {
      return focus.map((element) => element.key)
    } else {
      return path
    }
  }

  const menu = () => {
    let group = 0
    const groupedActions = actions
      .filter((item) => filterItem(item))
      .reduce((acc, item) => {
        if (item.group === undefined || item.group === null) item.group = 99
        if (!acc[item.group]) acc[item.group] = []
        acc[item.group].push(item)
        return acc
      }, [])
    let key = -1
    return groupedActions.map((groupItem, groupIndex) =>
      groupItem.map((item, index) => {
        key++
        const className = `px-3 remixui_liitem ${group !== item.group ? 'border-top' : ''}`
        group = item.group
        if (item.name === 'Upload File') {
          return (
            <li
              id={`menuitem${item.name.toLowerCase()}`}
              data-id={`contextMenuItem${item.id}`}
              key={key}
              className={className}
              onClick={() => {
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'uploadFile'])
                setShowFileExplorer(true)
              }}
            >
              {intl.formatMessage({
                id: `filePanel.${item.id}`,
                defaultMessage: item.label || item.name
              })}
            </li>
          )
        }

        if (item.name === 'Load a Local File') {
          return (
            <li
              id={`menuitem${item.name.toLowerCase()}`}
              data-id={`contextMenuItem${item.id}`}
              key={key}
              className={className}
              onClick={() => {
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'uploadFile'])
                setShowFileExplorer(true)
              }}
            >
              {intl.formatMessage({
                id: `filePanel.${item.id}`,
                defaultMessage: item.label || item.name
              })}
            </li>
          )
        }
        return (
          <li
            id={`menuitem${item.name.toLowerCase()}`}
            data-id={`contextMenuItem${item.id}`}
            key={key}
            className={className}
            onClick={(e) => {
              e.stopPropagation()
              switch (item.name) {
              case 'New File':
                createNewFile(path)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'newFile'])
                break
              case 'New Folder':
                createNewFolder(path)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'newFolder'])
                break
              case 'Rename':
                renamePath(path, type)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'rename'])
                break
              case 'Delete':
                deletePath(getPath())
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'delete'])
                break
              case 'Download':
                downloadPath(path)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'download'])
                break
              case 'Push changes to gist':
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'pushToChangesoGist'])
                pushChangesToGist(path)
                break
              case 'Publish folder to gist':
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'publishFolderToGist'])
                publishFolderToGist(path)
                break
              case 'Publish file to gist':
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'publishFileToGist'])
                publishFileToGist(path)
                break
              case 'Publish files to gist':
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'publishFilesToGist'])
                publishManyFilesToGist()
                break
              case 'Run':
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'runScript'])
                runScript(path)
                break
              case 'Copy':
                copy(path, type)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'copy'])
                break
              case 'Copy name':
                copyFileName(path, type)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'copyName'])
                break
              case 'Copy path':
                copyPath(path, type)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'copyPath'])
                break
              case 'Copy share URL':
                copyShareURL(path, type)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'copyShareURL'])
                break
              case 'Paste':
                paste(path, type)
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'paste'])
                break
              case 'Delete All':
                deletePath(getPath())
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'deleteAll'])
                break
              case 'Publish Workspace to Gist':
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'publishWorkspace'])
                publishFolderToGist(path)
                break
              case 'Sign Typed Data':
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', 'signTypedData'])
                signTypedData(path)
                break
              default:
                _paq.push(['trackEvent', 'fileExplorer', 'contextMenu', `${item.id}/${item.name}`])
                emit && emit({ ...item, path: [path]} as customAction)
                break
              }
              hideContextMenu()
            }}
          >
            {intl.formatMessage({
              id: `filePanel.${item.id}`,
              defaultMessage: item.label || item.name
            })}
          </li>
        )
      })
    )
  }

  return (
    <div
      id="menuItemsContainer"
      className="p-1 remixui_contextContainer bg-light shadow border"
      style={{ left: pageX, top: pageY }}
      ref={contextMenuRef}
      onBlur={hideContextMenu}
      tabIndex={500}
      {...otherProps}
    >
      {showFileExplorer && (
        <UploadFile
          onUpload={(target) => {
            uploadFile(target)
          }}
          multiple
        />
      )}
      <ul id="remixui_menuitems">{menu()}</ul>
    </div>
  )
}

export default FileExplorerContextMenu
