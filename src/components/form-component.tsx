import React from 'react'
// @ts-ignore
import styles from './form-component.module.scss'

import { Button, message } from 'antd'
import { InputComponent } from './input'
import { FaRegCircle } from 'react-icons/fa'
import { RiMenuAddLine } from 'react-icons/ri'
import { InputField } from '../types/input.type'

const FormComponent: React.FC = () => {
  const [inputFields, setInputFields] = React.useState<InputField[]>([
    { wallet: '', amount: '' },
  ])

  const totalAmount = inputFields.reduce(
    (acc, { amount }) => acc + parseFloat(amount || '0'),
    0
  )

  const onWithdraw = () => {
    setInputFields([{ wallet: '', amount: '', currency: 'USDT' }])
    message.success('The operation was successful')
  }

  const onInputChange = (
    index: number,
    field: 'wallet' | 'amount',
    value: string
  ) => {
    const newInputFields = [...inputFields]
    newInputFields[index][field] = value
    setInputFields(newInputFields)
  }

  const onAddRow = () => {
    try {
      setInputFields([
        ...inputFields,
        { wallet: '', amount: '', currency: 'USDT' },
      ])
      message.success('The task was successfully added')
    } catch (error) {
      message.error('The task could not be added')
    }
  }

  return (
    <div className={styles.form}>
      <h3>FROM</h3>
      <div className={styles.balance}>
        <span className={styles.balanceUSDT}>
          <FaRegCircle />
          <u>BALANCE USDT (ERC-20)</u>
        </span>
        <u className={styles.cash}>141 241.5121 USDT</u>
        <p>https://www.codewars.com/kata/58f5c63f1e26ecda7e000029/javascript</p>
      </div>
      <InputComponent
        onInputChange={onInputChange}
        setInputFields={setInputFields}
        inputFields={inputFields}
      />
      <div onClick={onAddRow} className={styles.addField}>
        <span>
          <RiMenuAddLine /> Add new wallet
        </span>
      </div>
      <div className={styles.receiveAmountBlock}>
        <h3>Receive amount</h3>
        <u className={styles.cash}>
          {totalAmount ? totalAmount.toFixed(2) : '0.00 '}
          USDT
        </u>
      </div>
      <Button onClick={onWithdraw} type="primary" color="gray">
        Withdraw
      </Button>
    </div>
  )
}
export default FormComponent
