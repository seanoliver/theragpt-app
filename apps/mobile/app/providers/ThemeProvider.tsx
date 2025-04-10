import React from 'react'

export interface ThemeProviderProps {
    children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    return <>{children}</>
}

export default ThemeProvider