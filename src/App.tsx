import React, { useCallback } from 'react'
import styles from './index.module.scss'

import * as XLSX from 'xlsx'
import { Button, message } from 'antd'
import { FaRegCircle } from 'react-icons/fa'
import { RiMenuAddLine } from 'react-icons/ri'
import { InputComponent } from './components/input'
import { InputField } from './components/input.type'

const App: React.FC = () => {
  const [balance, setBalance] = React.useState<number>(141241.5121)
  const [inputFields, setInputFields] = React.useState<InputField[]>([
    { wallet: '', amount: '', currency: 'USDT' },
  ])

  const totalAmount = inputFields.reduce(
    (acc, { amount }) => acc + parseFloat(amount || '0'),
    0
  )

  const onWithdraw = () => {
    console.log(
      inputFields,
      `Общий балан: ${balance}`,
      `Общая сумма платежа: ${totalAmount}`
    )
    if (balance < totalAmount) {
      message.error('the payment amount exceeds the balance amount')
    } else {
      setBalance(balance - totalAmount)
      setInputFields([{ wallet: '', amount: '', currency: 'USDT' }])
      message.success('The operation was successful')
    }
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
    setInputFields([
      ...inputFields,
      { wallet: '', amount: '', currency: 'USDT' },
    ])
  }

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
  return (
    <div
      className={styles.form}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onFileDrop}
    >
      <h3>FROM</h3>
      <div className={styles.balance}>
        <span className={styles.balanceUSDT}>
          <FaRegCircle />
          <u>BALANCE USDT (ERC-20)</u>
        </span>
        <b className={styles.cash}>{balance.toFixed(2)}USDT</b>
        <p>307a2bdf34a3e5058512d14f72f9181edb6d8f7974a4984e7f63</p>
      </div>
      <InputComponent
        onInputChange={onInputChange}
        setInputFields={setInputFields}
        inputFields={inputFields}
      />
      <div className={styles.blockAdd}>
        <span onClick={onAddRow} className={styles.addField}>
          <RiMenuAddLine /> Add new wallet
        </span>
      </div>

      <div className={styles.receiveAmountBlock}>
        <h3>Receive amount</h3>
        <b className={styles.cash}>
          {totalAmount ? totalAmount.toFixed(2) : '0.00 '}
          USDT
        </b>
      </div>
      <Button
        className={styles.customButton}
        onClick={onWithdraw}
        type="primary"
      >
        Withdraw
      </Button>
    </div>
  )
}

export default App
