import React from 'react'
import styles from '../index.module.scss'

import { Input, message } from 'antd'
import { InputComponentProps } from './WalletFields.type'

export const WalletFields: React.FC<InputComponentProps> = ({
  inputFields,
  onInputChange,
  setInputFields,
}) => {
  const onRemoveRow = (index: number) => {
    const newInputFields = [...inputFields]
    newInputFields.splice(index, 1)
    setInputFields(newInputFields)
  }

  const onClearInput = (index: number) => {
    try {
      const newInputFields = [...inputFields]
      newInputFields[index] = { wallet: '', amount: '', currency: 'USDT' }
      setInputFields(newInputFields)
      message.success('The fields have been cleared successfully')
    } catch (error) {
      message.error('The fields could not be cleared')
    }
  }

  return (
    <div>
      {inputFields.map((field, index) => (
        <div key={index} className={styles.inputBlock}>
          <span className={styles.inputs}>
            {index > 0 && (
              <>
                <label
                  className={styles.removeInput}
                  onClick={() => onRemoveRow(index)}
                >
                  REMOVE
                </label>
              </>
            )}
            <Input
              placeholder="wallet address"
              value={field.wallet}
              onChange={(e) => onInputChange(index, 'wallet', e.target.value)}
            />
          </span>
          <span className={styles.inputs}>
            <Input
              type="number"
              placeholder="amount"
              suffix={field.currency}
              value={field.amount}
              onChange={(e) => onInputChange(index, 'amount', e.target.value)}
            />

            <label onClick={() => onClearInput(index)}>CLEAR</label>
          </span>
        </div>
      ))}
    </div>
  )
}
