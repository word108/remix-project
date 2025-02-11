import React from 'react'
import { ViewPlugin } from '@remixproject/engine-web'
import { PluginViewWrapper } from '@remix-ui/helper'
import { RemixAppManager } from '../../remixAppManager'
import { RemixUiVyperCompileDetails } from '@remix-ui/vyper-compile-details'
import { ThemeKeys, ThemeObject } from '@microlink/react-json-view'
//@ts-ignore
const _paq = (window._paq = window._paq || [])

const profile = {
  name: 'vyperCompilationDetails',
  displayName: 'Vyper Compile Details',
  description: 'Displays details from vyper compiler',
  location: 'mainPanel',
  methods: ['showDetails'],
  events: []
}

export class VyperCompilationDetailsPlugin extends ViewPlugin {
  dispatch: React.Dispatch<any> = () => {}
  appManager: RemixAppManager
  element: HTMLDivElement
  payload: any
  themeStyle: any
  theme: ThemeKeys | ThemeObject
  constructor(appManager: RemixAppManager) {
    super(profile)
    this.appManager = appManager
    this.element = document.createElement('div')
    this.element.setAttribute('id', 'vypercompileDetails')
    this.payload = {
      contractProperties: {} as any,
      selectedContract: '',
      help: {} as any,
      insertValue: {} as any,
      saveAs: {} as any,
    }
  }

  async onActivation() {
    this.handleThemeChange()
    await this.call('tabs', 'focus', 'vyperCompilationDetails')
    this.renderComponent()
    _paq.push(['trackEvent', 'plugin', 'activated', 'vyperCompilationDetails'])
  }

  onDeactivation(): void {

  }

  async showDetails(sentPayload: any) {
    const contractName = Object.entries(sentPayload).find(([key, value]) => key )
    await this.call('tabs', 'focus', 'vyperCompilationDetails')
    this.profile.displayName = `${contractName[0]}`
    this.payload = sentPayload
    const active = await this.call('theme', 'currentTheme')
    if (active.quality === 'dark') {
      switch (active.name) {
      case 'HackerOwl':
        this.theme = 'harmonic'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      case 'Black':
        this.theme = 'eighties'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      case 'Cyborg':
        this.theme = 'shapeshifter'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      case 'Dark':
        this.theme = 'flat'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      default:
        this.theme = 'shapeshifter'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      }
    } else {
      switch (active.name) {
      case 'Candy':
        this.theme = 'apathy:inverted'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      case 'Midcentury':
        this.theme = 'apathy:inverted'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      case 'Unicorn':
        this.theme = 'apathy:inverted'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      case 'Violet':
        this.theme = 'summerfruit:inverted'
        this.themeStyle = { backgroundColor: active.backgroundColor }
        break
      default:
        this.theme = 'bright:inverted'
        break
      }
    }
    this.renderComponent()
  }

  private handleThemeChange() {
    this.on('theme', 'themeChanged', (theme: any) => {
      if (theme.quality === 'dark') {
        switch (theme.name) {
        case 'HackerOwl':
          this.theme = 'solarized'
          this.themeStyle = { backgroundColor: theme.backgroundColor }
          break
        case 'Black':
          this.theme = 'shapeshifter'
          this.themeStyle = { backgroundColor: theme.backgroundColor }
          break
        case 'Cyborg':
          this.theme = 'shapeshifter'
          this.themeStyle = { backgroundColor: theme.backgroundColor }
          break
        case 'Dark':
          this.theme = 'harmonic'
          this.themeStyle = { backgroundColor: theme.backgroundColor }
          break
        default:
          this.theme = 'shapeshifter'
          this.themeStyle = { backgroundColor: theme.backgroundColor }
          break
        }
      } else {
        this.theme = 'bright:inverted'
        this.themeStyle = { backgroundColor: theme.backgroundColor }
      }
      this.renderComponent()
    })
  }

  setDispatch(dispatch: React.Dispatch<any>): void {
    this.dispatch = dispatch
    this.renderComponent()
  }
  render() {
    return (
      <div className="d-flex h-100 w-100 m-0 p-5 bg-light" id="compileDetails">
        <PluginViewWrapper plugin={this} />
      </div>
    )
  }

  renderComponent() {
    this.dispatch({
      ...this,
      ...this.payload,
      themeStyle: this.themeStyle,
      theme: this.theme
    })
  }

  updateComponent(state: any) {
    return (
      <RemixUiVyperCompileDetails
        payload={state.payload}
        theme={state.theme}
        themeStyle={state.themeStyle}
      />
    )
  }

}
