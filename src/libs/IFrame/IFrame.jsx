import React, { useContext } from "react"
import Frame, { FrameContext } from "react-frame-component"
import { StyleSheetManager } from "styled-components"

export const IFrame = (props) => {
  const { style, children, ...otherProps } = props
  const initialContent = `<!DOCTYPE html><html><head>
   <link    rel="stylesheet"    href="https://et-staging-api.ringover-crm.xyz/css/main.css"  />
  </head><body><div></div></body></html>`

  return (
    <Frame height={600} width={500}>
      <link rel="stylesheet" href="https://et-staging-api.ringover-crm.xyz/css/main.css" />
      {children}
    </Frame>
  )
}
