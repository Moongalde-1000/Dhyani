import { AxiosInstance } from 'axios'

export interface StaticPageItem {
  id: string
  staticType: string
  title: string
  description: string
  staticImage?: string
  phone?: string
  email?: string
  location?: string
  goalText?: string
  missionDescription?: string
  visionDescription?: string
  valuesDescription?: string
  createdAt?: string
  updatedAt?: string
}

export const getStaticPageListAPI = async (api: AxiosInstance) => {
  return api.get('/staticpage')
}

export const getStaticPageByIdAPI = async (api: AxiosInstance, id: string) => {
  return api.get(`/staticpage/${id}`)
}

export const upsertStaticPageAPI = async (api: AxiosInstance, data: FormData) => {
  return api.post('/staticpage', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const updateStaticPageAPI = async (api: AxiosInstance, id: string, data: FormData) => {
  return api.put(`/staticpage/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
