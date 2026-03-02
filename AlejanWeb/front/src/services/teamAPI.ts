import { AxiosInstance } from 'axios'

export interface TeamItem {
    id: string
    name: string
    designation: string
    linkedInID?: string
    twitterID?: string
    teamImage?: string
    createdAt?: string
    updatedAt?: string
}

export const getTeamListAPI = async (api: AxiosInstance) => {
    return api.get('/team')
}

export const getTeamByIdAPI = async (api: AxiosInstance, id: string) => {
    return api.get(`/team/${id}`)
}

export const createTeamAPI = async (api: AxiosInstance, data: FormData) => {
    return api.post('/team', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const updateTeamAPI = async (api: AxiosInstance, id: string, data: FormData) => {
    return api.put(`/team/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const deleteTeamAPI = async (api: AxiosInstance, id: string) => {
    return api.delete(`/team/${id}`)
}
