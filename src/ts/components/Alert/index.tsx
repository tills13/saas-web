import React from "react"
import styled, { css } from "styled"

type AlertType = "danger" | "info" | "success" | "warning"

interface AlertProps extends React.AllHTMLAttributes<HTMLDivElement> {
  alertType?: AlertType
  className?: string
  inline?: boolean
}

function alertType (
  alertType: AlertProps[ "alertType" ],
  color: string,
  background: string,
  backgroundColor: string
) {
  return (p: AlertProps) => p.alertType === alertType && css`
    color: ${ color };
    background: ${ background };
    border-color: ${ backgroundColor };
  `
}

const Alert = styled.div`
  padding: 12px;

  line-height: 12px;

  border-width: 1px;
  border-style: solid;
  border-radius: 2px;

  ${ (p: AlertProps) => p.inline && css`
    display: inline-block;
    padding: 9px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  ` }

  ${ alertType("info", "#636363", "#eaeaea", "#afafaf") }
  ${ alertType("success", "#fff", "#32d194", "#13573d") }
  ${ alertType("danger", "#fff", "#d65555", "#761c1c") }
  ${ alertType("warning", "#636363", "#f8f08d", "#decf0e") }
` as React.ComponentType<AlertProps>

export default Alert
