import { AxiosInstance } from 'axios'

export interface FaqItem {
    id: string
    title: string
    description: string
    createdAt?: string
    updatedAt?: string
}

export const getFaqListAPI = async (api: AxiosInstance) => {
    return api.get('/faq')
}

export const getFaqByIdAPI = async (api: AxiosInstance, id: string) => {
    return api.get(`/faq/${id}`)
}

export const createFaqAPI = async (api: AxiosInstance, data: any) => {
    return api.post('/faq', data)
}

export const updateFaqAPI = async (api: AxiosInstance, id: string, data: any) => {
    return api.put(`/faq/${id}`, data)
}

export const deleteFaqAPI = async (api: AxiosInstance, id: string) => {
    return api.delete(`/faq/${id}`)
}
