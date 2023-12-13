export type InputField = {
  wallet: string
  amount: string
  currency?: string
}

export type InputComponentProps = {
  onInputChange: (
    index: number,
    field: 'wallet' | 'amount',
    value: string
  ) => void
  setInputFields: (fields: InputField[]) => void
  inputFields: InputField[]
}
