import { AxiosInstance } from 'axios'

export interface ContactUsItem {
    id: string
    name: string
    email: string
    phone: string
    subject: string
    createdAt: string
    updatedAt: string
}

export const getContactUsListAPI = async (api: AxiosInstance) => {
    return api.get('/contact-us')
}

export const getContactUsByIdAPI = async (api: AxiosInstance, id: string) => {
    return api.get(`/contact-us/${id}`)
}
