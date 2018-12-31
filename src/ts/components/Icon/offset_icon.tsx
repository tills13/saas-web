import React from "react"

import Icon, { IconProps } from "."

type IconOffsetType = { [ icon: string ]: React.CSSProperties }
const OFFSET_FIXES: IconOffsetType = {
  // "chevron-left": { position: "relative", left: "-2px" }
  "av-timer": { position: "relative", top: "1.5px" }
}

function OffsetIcon ({ icon, ...rest }: IconProps) {
  return <Icon icon={ icon } { ...rest } style={ OFFSET_FIXES[ icon ] } />
}

export default OffsetIcon
