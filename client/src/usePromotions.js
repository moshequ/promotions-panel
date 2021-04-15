import { useEffect, useState, useReducer } from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000'
const initialState = {
  loading: false,
  error: '',
  promotions: [],
  columns: [],
}

// TODO: optimize (server/db/dynamic schema)
function getColumns(promotions, values = []) {
  const set = new Set(values);
  promotions.map(doc => Object.keys(doc.fields).forEach(set.add, set))
  return [...set]
}

const actions = {
  // TODO: wait / cancel prev requests
  RESET: () => axios.get(`${BASE_URL}/promotions/reset`),
  LIST: lastId => axios.get(`${BASE_URL}/promotions`, { params: { lastId } }),
  EDIT: data => axios.put(`${BASE_URL}/promotions/${data._id}`, data),
  DELETE: ids => axios.delete(`${BASE_URL}/promotions`, { data: { ids } }),
  DUPLICATE: data => axios.post(`${BASE_URL}/promotions`, data)
}
let setState

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...action.payload }
    case 'RESET':
      actions.RESET()
        .then((res) => {
          return setState({
            type: 'SET', payload: {
              ...state,
              loading: false,
              error: '',
              hasMore: res.data.docs.length > 0,
              promotions: [...res.data.docs],
              columns: getColumns(res.data.docs)
            }
          })
        })
        .catch(error => setState({
          type: 'SET',
          payload: { ...state, loading: false, error: (error && error.message) || 'Error' }
        }))
      return { ...state, loading: true }
    case 'LIST':
      actions.LIST(action.payload)
        .then((res) => {
          return setState({
            type: 'SET', payload: {
              ...state,
              loading: false,
              error: '',
              hasMore: res.data.docs.length > 0,
              promotions: [...res.data.docs, ...state.promotions],
              columns: getColumns(res.data.docs, state.columns)
            }
          })
        })
        .catch(error => setState({
          type: 'SET',
          payload: { ...state, loading: false, error: (error && error.message) || 'Error' }
        }))
      return { ...state, loading: true }
    case 'EDIT':
      actions.EDIT(action.payload)
        .then((res) => {
          // TODO: use splice instead
          console.log(action.payload)
          const promotions = state.promotions.map(promotion => action.payload._id === promotion._id ? action.payload : { ...promotion });
          return setState({
            type: 'SET', payload: {
              ...state,
              loading: false,
              error: '',
              promotions,
              columns: getColumns(promotions)
            }
          })
        })
        .catch(error => setState({
          type: 'SET',
          payload: { ...state, loading: false, error: (error && error.message) || 'Error' }
        }))
      return { ...state, loading: true }
    case 'DELETE':
      if (window.confirm("Do you really want to delete?")) {
        actions.DELETE(action.payload)
          .then((res) => {
            const promotions = state.promotions.filter(({ _id }) => !action.payload.includes(_id))
            return setState({
              type: 'SET', payload: {
                ...state,
                loading: false,
                error: '',
                promotions,
                columns: getColumns(promotions)
              }
            })
          })
          .catch(error => setState({
            type: 'SET',
            payload: { ...state, loading: false, error: (error && error.message) || 'Error' }
          }))
        return { ...state, loading: true }
      }
      return state
    case 'DUPLICATE':
      const promotions = state.promotions
        .filter(({ _id }) => action.payload.includes(_id))

      actions.DUPLICATE(promotions)
        .then((res) => {
          const promotions = state.promotions
            .filter(({ _id }) => action.payload.includes(_id))
            .map((v, i) => ({ ...v, _id: i + Date.now() }))
            .concat(state.promotions)
          return setState({
            type: 'SET', payload: {
              ...state,
              loading: false,
              error: '',
              promotions: [...res.data.docs, ...state.promotions], // TODO: keep list order
              columns: getColumns(res.data.docs, state.columns)
            }
          })
        })
        .catch(error => setState({
          type: 'SET',
          payload: { ...state, loading: false, error: (error && error.message) || 'Error' }
        }))
      return { ...state, loading: true }
    default:
      throw new Error(`Unhandled type: ${action.type}`)
  }
}

export default function usePromotions() {
  const [lastId, setLastId] = useState()
  const [{ promotions, columns, hasMore, loading, error }, dispatch] = useReducer(reducer, initialState)
  setState = dispatch

  useEffect(() => {
    dispatch({ type: 'LIST', payload: lastId })
  }, [lastId])

  return { loading, error, promotions, columns, hasMore, dispatch, lastId, setLastId }
}
