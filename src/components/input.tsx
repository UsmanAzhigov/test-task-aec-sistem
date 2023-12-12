import React, { useCallback } from 'react'
// @ts-ignore
import styles from './form-component.module.scss'

import * as XLSX from 'xlsx'
import { Input, message } from 'antd'
import { InputComponentProps, InputField } from '../types/input.type'

export const InputComponent: React.FC<InputComponentProps> = ({
  inputFields,
  onInputChange,
  setInputFields,
}) => {
  const onFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      onAddInputFull(file)
    }
  }, [])

  const onAddInputFull = (file: File) => {
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          const content = event.target.result
          if (content) {
            const workbook = XLSX.read(content, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[firstSheetName]
            const parsedData = XLSX.utils.sheet_to_json(sheet)
            console.log(parsedData)

            const newInputFields: InputField[] = parsedData.map(
              (data: any) => ({
                wallet: data['Mass sending list'] || '',
                amount: data['__EMPTY'] || '',
                currency: data['__EMPTY_1'] || 'USDT',
              })
            )
            setInputFields(newInputFields)
          }
        }
      }

      reader.readAsArrayBuffer(file)
      message.success('Fields have been added successfully')
    } catch (error) {
      message.error('Fields could not be added')
    }
  }

  const onRemoveRow = (index: number) => {
    try {
      const newInputFields = [...inputFields]
      newInputFields.splice(index, 1)
      setInputFields(newInputFields)
      message.success('Fields have been successfully deleted')
    } catch (error) {
      message.error('Fields could not be deleted')
    }
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
    <div onDragOver={(e) => e.preventDefault()} onDrop={onFileDrop}>
      {inputFields.map((field, index) => (
        <div key={index} className={styles.inputBlock}>
          <Input
            placeholder="wallet address"
            value={field.wallet}
            onChange={(e) => onInputChange(index, 'wallet', e.target.value)}
          />

          <span className={styles.inputs}>
            <Input
              type="number"
              placeholder="amount"
              suffix={field.currency}
              value={field.amount}
              onChange={(e) => onInputChange(index, 'amount', e.target.value)}
            />

            {index === 0 ? (
              ''
            ) : (
              <>
                <label
                  className={styles.removeInput}
                  onClick={() => onRemoveRow(index)}
                >
                  REMOVE
                </label>
              </>
            )}
            <label onClick={() => onClearInput(index)}>CLEAR</label>
          </span>
        </div>
      ))}
    </div>
  )
}
