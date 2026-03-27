import { useState, type FocusEvent } from 'react'
import type { FieldValues, UseFormRegister } from 'react-hook-form'
import type { FocusedStates } from '../types'

// manages focused state for form inputs and preserves
// react-hook-form's onBlur for validation
export function useFormFocus<T extends FieldValues>(
  register: UseFormRegister<T>
) {
  const [focused, setFocused] = useState<FocusedStates>({})

  const registerWithFocus = (name: Parameters<UseFormRegister<T>>[0]) => {
    const { onBlur, ...rest } = register(name)
    return {
      ...rest,
      onFocus: (event: FocusEvent<HTMLInputElement, Element>) => {
        setFocused((prev) => ({ ...prev, [event.target.name]: true }))
      },
      onBlur: (event: FocusEvent<HTMLInputElement, Element>) => {
        setFocused((prev) => ({ ...prev, [event.target.name]: false }))
        void onBlur(event)
      }
    }
  }

  return { focused, registerWithFocus }
}
