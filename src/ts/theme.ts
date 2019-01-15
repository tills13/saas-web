export interface ThemeInterface {
  primaryColor: string

  pBlue: string
  pRed: string
  pGreen: string
  pYellow: string
  pGrey: string
}

export const defaultTheme: ThemeInterface = {
  primaryColor: "lightblue",
  pBlue: "blue",
  pRed: "red",
  pGreen: "green",
  pYellow: "yellow",
  pGrey: "grey"
}

export default defaultTheme
