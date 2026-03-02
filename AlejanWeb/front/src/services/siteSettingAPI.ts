import { AxiosInstance } from 'axios'

export interface SiteSettingItem {
    id?: string
    signUpTitle: string
    loginTitle: string
    forgotPasswordTitle: string
    aboutpageTitle: string
    contactusTitle: string
    faqTitle: string
    eventListTitle: string
    myEventDetailTitle: string
    publicEventDetailTitle: string
    footerTitle: string
    footerDescription: string
    linkedInID: string
    twitterID: string
    createdAt?: string
    updatedAt?: string
}

export const getSiteSettingAPI = async (api: AxiosInstance) => {
    return api.get('/site-setting')
}

export const upsertSiteSettingAPI = async (api: AxiosInstance, data: SiteSettingItem) => {
    return api.post('/site-setting', data)
}
