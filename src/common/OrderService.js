import { API_BASE_URL, IAMPORT_URL } from './serverConfig'
import { IAMPORT_REST_KEY, IAMPORT_REST_SECRET } from './constants'
import axios from 'axios'
import qs from 'qs'

export const getOrdersByUserId = (userId, curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/orders/user/${userId}?curPage=${curPage}&perPage=${perPage}`)
}

export const getOrderById = id => {
  return axios.get(`${API_BASE_URL}/orders/${id}`)
}

export const postOrder = order => {
  return axios.post(`${API_BASE_URL}/orders`, order)
}

export const postOrderTransaction = order => {
  return axios.post(`${API_BASE_URL}/orders/transaction`, order, { validateStatus: status => status === 200 })
}

export const updateOrder = (order, id) => {
  return axios.post(`${API_BASE_URL}/orders/${id}`, order)
}

const getBankCode = bankName => {
  if (bankName === '기업은행') return '03'
  else if (bankName === '외환은행') return '05'
  else if (bankName === '농협중앙회') return '11'
  // TODO
}

export const cancelPayment = order => {
  return axios.post(`${IAMPORT_URL}/users/getToken`, qs.stringify(
    { imp_key: IAMPORT_REST_KEY, imp_secret: IAMPORT_REST_SECRET }
  ))
  .then(res => {
    // console.log('token res', res)
    const token = res.response.access_token
    const params = {}
    params.imp_uid = order.uid
    params.reason = '결제 후 처리 중 에러발생'
    if (order.paymentMethod === 'vbank') {
      params.refund_holder = order.vbankHolder
      params.refund_bank = getBankCode(order.vbankBank)
      params.refund_account = order.vbankNum
    }
    return axios(`${IAMPORT_URL}/payments/cancel`, qs.stringify(params), { headers: { 'Authorization': token } })
  })
}
