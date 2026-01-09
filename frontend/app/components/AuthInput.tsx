"use client"
import { useState } from "react"
import { theme } from "@/lib/theme"
import { EyeIcon, EyeSlashIcon } from "./AuthIcons"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
  isValid?: boolean
  isPassword?: boolean
}

export default function AuthInput({ 
  label, 
  name, 
  error, 
  isValid, 
  isPassword = false, 
  className, 
  ...props 
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  let borderColor = "#ced4da"
  let borderWidth = "1px"
  let boxShadow = "none"

  if (error) {
    borderColor = "#dc3545"
    borderWidth = "2px"
  } else if (isFocused) {
    borderColor = theme.primary
    borderWidth = "2px"
    boxShadow = "0 0 0 3px rgba(0, 135, 90, 0.1)"
  } else if (isValid) {
    borderColor = "#198754"
    borderWidth = "1px"
  }

  const containerStyle = {
    height: "48px",
    borderRadius: "6px",
    border: `${borderWidth} solid ${borderColor}`,
    boxShadow: boxShadow,
    transition: "all 0.2s ease-in-out",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff"
  }

  const inputType = isPassword && !showPassword ? "password" : "text"

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-bold small text-dark mb-1">
        {label}
      </label>
      
      <div style={containerStyle}>
        <input
          {...props}
          id={name}
          name={name}
          type={inputType}
          className={`form-control border-0 h-100 px-3 ${className || ""}`}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
        />
        
        {isPassword && (
          <button 
            className="btn bg-white border-0 h-100 pe-3 ps-2 d-flex align-items-center" 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: "#dc3545", fontSize: "0.75rem", marginTop: "4px", fontWeight: 700, paddingLeft: "2px" }}>
          {error}
        </div>
      )}
    </div>
  )
}