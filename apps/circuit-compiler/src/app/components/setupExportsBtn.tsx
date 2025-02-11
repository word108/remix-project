import { CustomTooltip, RenderIf } from "@remix-ui/helper"
import { FormattedMessage } from "react-intl"
import { CompilerStatus } from "../types"

export function SetupExportsBtn ({ handleRunSetup, status }: { handleRunSetup: () => Promise<void>, status: CompilerStatus }) {
  return <button
    className="btn btn-secondary btn-block d-block w-100 text-break mt-2"
    onClick={handleRunSetup}
    data-id="runSetupBtn"
  >
    <CustomTooltip
      placement="auto"
      tooltipId="overlay-tooltip-compile"
      tooltipText={
        <div className="text-left">
          <div>
              Click to setup and export verification keys
          </div>
        </div>
      }
    >
      <div className="d-flex align-items-center justify-content-center">
        <RenderIf condition={status === 'exporting'}>
          <i className="fas fa-sync fa-spin mr-2" aria-hidden="true"></i>
        </RenderIf>
        <div className="text-truncate overflow-hidden text-nowrap">
          <span>
            <FormattedMessage id="circuit.runSetup" />
          </span>
        </div>
      </div>
    </CustomTooltip>
  </button>
}