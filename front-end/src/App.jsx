import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('VND')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    fetch('/api/v1/currency/convert?from=USD&to=VND&amount=1')
      .then(res => res.json())
      .then(data => {
        if (data.currencyCodes) {
          setCurrencies(data.currencyCodes)
        }
      })
      .catch(() => setCurrencies(['USD', 'VND']))
  }, [])

  const parseDisplayAmount = (display) => {
    if (!display) return NaN
    // Xóa tất cả dấu chấm (hàng nghìn)
    const normalized = display.replace(/\./g, '')
    const num = parseFloat(normalized)
    return isNaN(num) ? NaN : num
  }

  const handleAmountChange = (rawValue) => {
    if (rawValue === '') {
      setAmount('')
      return
    }
    // Chỉ giữ lại số
    const cleaned = rawValue.replace(/[^0-9]/g, '')
    if (cleaned === '') {
      setAmount('')
      return
    }
    // Xóa số 0 ở đầu
    const number = cleaned.replace(/^0+/, '') || '0'
    // Thêm dấu chấm phân cách hàng nghìn
    const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    setAmount(formatted)
  }

  const handleConvert = async (e) => {
    e.preventDefault()
    const numericAmount = parseDisplayAmount(amount)
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch(
        `/api/v1/currency/convert?from=${fromCurrency}&to=${toCurrency}&amount=${encodeURIComponent(numericAmount)}`
      )
      if (!response.ok) {
        throw new Error('Không thể chuyển đổi tiền tệ')
      }
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi chuyển đổi')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
  }

  return (
    <div className="main-bg">
      <div className="converter-card custom-card">
        <h2 className="exchange-title">Tỷ giá chuyển đổi thực</h2>
        {result && (
          <div className="exchange-rate">
            <span className="rate-label">
              1 {result.from} = <b>{Number(result.rate).toLocaleString('vi-VN', { maximumFractionDigits: 6 })} {result.to}</b>
            </span>
          </div>
        )}
        <form onSubmit={handleConvert} className="converter-form custom-form">
          <div className="form-label">Số tiền</div>
          <div className="input-row">
            <div className="input-box">
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="1.000"
                className="big-input"
              />
              <div className="currency-select">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="currency-dropdown"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <span className="dropdown-arrow">▼</span>
            </div>
            </div>
            
          </div>
          <div className="swap-row">
            <button
              type="button"
              onClick={handleSwap}
              className="swap-circle"
              title="Hoán đổi"
            >
              <span className="swap-icon">⇅</span>
            </button>
          </div>
          <div className="form-label">Chuyển đổi thành</div>
          <div className="input-row">
            <div className="input-box">
              <div className="big-result">
                {result ? <b>{Number(result.convertedAmount).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}</b> : <b>0</b>}
              </div>
              <div className="currency-select">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="currency-dropdown"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <span className="dropdown-arrow">▼</span>
            </div>
            </div>
            
          </div>
          <button
            type="submit"
            disabled={loading}
            className="convert-button custom-convert"
          >
            {loading ? 'Đang chuyển đổi...' : 'Chuyển đổi'}
          </button>
        </form>
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

