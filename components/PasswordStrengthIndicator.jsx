'use client'
import { Check, X } from "lucide-react"

const PasswordStrengthIndicator = ({ password }) => {
  // Password validation criteria
  const validations = [
    { id: 1, text: "At least 6 characters", valid: password.length >= 6 },
    { id: 2, text: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { id: 3, text: "Contains lowercase letter", valid: /[a-z]/.test(password) },
    { id: 4, text: "Contains a number", valid: /\d/.test(password) },
    { id: 5, text: "Contains special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ]

  // Calculate strength
  const validCount = validations.filter(v => v.valid).length
  const strength = Math.min(Math.floor((validCount / validations.length) * 100), 100)

  // Determine strength label and color
  let strengthLabel = ""
  let strengthColor = ""
  if (strength === 0) {
    strengthLabel = ""
    strengthColor = ""
  } else if (strength < 40) {
    strengthLabel = "Weak"
    strengthColor = "bg-red-500"
  } else if (strength < 80) {
    strengthLabel = "Medium"
    strengthColor = "bg-yellow-500"
  } else {
    strengthLabel = "Strong"
    strengthColor = "bg-green-500"
  }

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">Password strength</span>
        {strength > 0 && (
          <span className={`text-sm font-medium ${strengthColor.includes('red') ? 'text-red-500' : strengthColor.includes('yellow') ? 'text-yellow-500' : 'text-green-500'}`}>
            {strengthLabel}
          </span>
        )}
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
        <div 
          className={`h-1.5 rounded-full ${strengthColor}`} 
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      
      <div className="space-y-1">
        {validations.map((validation) => (
          <div key={validation.id} className="flex items-center text-sm">
            {validation.valid ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <X className="h-4 w-4 text-slate-400 mr-2" />
            )}
            <span className={validation.valid ? "text-slate-700" : "text-slate-500"}>
              {validation.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PasswordStrengthIndicator