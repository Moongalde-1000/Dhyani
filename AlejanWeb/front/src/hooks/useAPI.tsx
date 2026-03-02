import axios from 'axios'
import { useAuth } from './useAuth'
import {
  checkEmailAPI,
  checkPhoneNumberAPI,
  checkUsernameAPI,
  forgotPasswordAPI,
  forgotUsernameAPI,
  resetPasswordAPI,
  sendVerifyEmailAPI,
  sendVerifyEmailAPIPayload,
  sendVerifyPhoneAPI,
  sendVerifyPhoneAPIPayload,
  verifyAPIPayload,
  verifyEmailAPI,
  verifyPhoneAPI,
  verifyResetPasswordTokenAPI
} from '../services/authAPI'

import {
  getClientByIdAPI,
  getClientsAPI,
  // updateChangePasswordAPI,
  // updateUserProfileAPI,
  suspendClientAPI
} from '../services/clientAPI'
import { getDashboardAPI } from '../services/dashboardAPI'
import { getSession } from 'next-auth/react'
//import { getStaticPageByIdAPI, getStaticPageListAPI, updateStaticPageAPI } from '../services/staticPageAPI'
import { getStaticPageByIdAPI, getStaticPageListAPI, updateStaticPageAPI, upsertStaticPageAPI } from '../services/staticPageAPI'

import {
  getTeamListAPI,
  getTeamByIdAPI,
  createTeamAPI,
  updateTeamAPI,
  deleteTeamAPI
} from '../services/teamAPI'

import {
  getFaqListAPI,
  getFaqByIdAPI,
  createFaqAPI,
  updateFaqAPI,
  deleteFaqAPI
} from '../services/faqAPI'

import {
  getContactUsListAPI,
  getContactUsByIdAPI
} from '../services/contactUsAPI'

import {
  getSiteSettingAPI,
  upsertSiteSettingAPI
} from '../services/siteSettingAPI'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://server.keshavinfotechdemo2.com:4017'

const useAPI = async () => {


  // const auth = useAuth()
  const auth = await getSession()
  console.log('test', auth)
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${auth?.user.sessionToken || ''}`,
      'Refresh-Token': auth?.user.refreshToken || ''
    },
    timeout: 50000000000,
    withCredentials: false
  })

  api.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response && error.response.status === 401) {
        if (auth.currentAuth?.remember) {
          auth
            .generateSession()
            .then(res => {
              console.log(res)
            })
            .catch(error => {
              console.log(error)
              auth.logoutUser()
              return Promise.reject(error)
            })
        } else {
          auth.logoutUser()
        }
      }
      return Promise.reject(error)
    }
  )

  return {
    auth: {
      sendVerifyEmailAPI: (data: sendVerifyEmailAPIPayload) => sendVerifyEmailAPI(api, data),
      verifyEmailAPI: (data: verifyAPIPayload) => verifyEmailAPI(api, data),
      sendVerifyPhoneAPI: (data: sendVerifyPhoneAPIPayload) => sendVerifyPhoneAPI(api, data),
      verifyPhoneAPI: (data: verifyAPIPayload) => verifyPhoneAPI(api, data),
      forgotUsername: (data: any) => forgotUsernameAPI(api, data),
      forgotPassword: (data: any) => forgotPasswordAPI(api, data),
      resetPassword: (data: any) => resetPasswordAPI(api, data),
      verifyResetPasswordToken: (data: any) => verifyResetPasswordTokenAPI(api, data),
      checkUsername: (data: any) => checkUsernameAPI(api, data),
      checkEmail: (data: any) => checkEmailAPI(api, data),
      checkPhoneNumber: (data: any) => checkPhoneNumberAPI(api, data)
    },
    dashboard: {
      get: (data?: any) => getDashboardAPI(api, data)
    },
    /*user: {
      update: (data: any) => updateUserProfileAPI(api, data),
      getUserById: (data: any) => getClientByIdAPI(api, data),
      changePassword: (data: any) => updateChangePasswordAPI(api, data),
      //get: (data?: any) => getUsersAPI(api, data)
    },*/
    clientManagement: {
      get: (data?: any) => getClientsAPI(api, data),
      getById: (id: string) => getClientByIdAPI(api, { id }),
      suspend: (id: string, suspend: boolean) => suspendClientAPI(api, id, suspend)
    },
    staticPage: {
      list: () => getStaticPageListAPI(api),
      getById: (id: string) => getStaticPageByIdAPI(api, id),
      update: (id: string, data: FormData) => updateStaticPageAPI(api, id, data),
      upsert: (data: FormData) => upsertStaticPageAPI(api, data)
    },
    team: {
      list: () => getTeamListAPI(api),
      getById: (id: string) => getTeamByIdAPI(api, id),
      create: (data: FormData) => createTeamAPI(api, data),
      update: (id: string, data: FormData) => updateTeamAPI(api, id, data),
      delete: (id: string) => deleteTeamAPI(api, id)
    },
    faq: {
      list: () => getFaqListAPI(api),
      getById: (id: string) => getFaqByIdAPI(api, id),
      create: (data: any) => createFaqAPI(api, data),
      update: (id: string, data: any) => updateFaqAPI(api, id, data),
      delete: (id: string) => deleteFaqAPI(api, id)
    },
    contactUs: {
      list: () => getContactUsListAPI(api),
      getById: (id: string) => getContactUsByIdAPI(api, id)
    },
    siteSetting: {
      get: () => getSiteSettingAPI(api),
      upsert: (data: any) => upsertSiteSettingAPI(api, data)
    }
  }
}

export default useAPI
