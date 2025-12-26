// stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'http://localhost:3002' // e.g. 'http://localhost:3001' (or leave '' if same origin)

export const useAuthStore = defineStore('auth', {
    state: () => ({
        status: 'unknown',          // 'unknown' | 'authenticated' | 'unauthenticated'
        user: null,                 // user object from /me (or null)
        accessToken: null           // short-lived JWT for Authorization: Bearer ...
    }),

    actions: {
        // ---- state setters (single source of truth) ----
        setAuthenticated(accessToken, user = null) {
            console.log("seting auth ", accessToken)
            if (accessToken) this.accessToken = accessToken
            if (user) this.user = user
            this.status = 'authenticated'
            console.log("setting auth: ", this.status)
        },

        setUnauthenticated() {
            this.status = 'unauthenticated'
            this.user = null
            this.accessToken = null
        },

        // ---- helpers ----
        _authHeaders() {
            return this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}
        },

        // ---- core lifecycle ----
        async init() {
           
            try {
                
            
                await this.refresh();
                await this.getMe();
                
               
            } catch (err) {
                console.log(`any errors? ${err}`)
                this.setUnauthenticated()
            }
        },

        async getMe(){

                if(!this._authHeaders()){
                    console.log("NO AUTH HEADERS!!!")
                }
            try {
                  const response = await axios.get(`${BASE_URL}/users/me`, {
                    headers: this._authHeaders(),
                    withCredentials: true
                })
                const user = response?.data?.data?.user;
                
                if(!user){
                    throw new Error("no user returned")
                }

                this.user = user;

                return user;
                
            } catch (error) {
                console.log(error)
            }   

          
                


        },

        async register(email, password, name) {
            const url = BASE_URL + '/auth/register'
            
            try {
                  const response = await axios.post(
                url,
                { email, password, name },
                { withCredentials: true }
            )
            
            console.log(response)
            
            
            this.status = 'unauthenticated'

            return response?.data?.data
            } catch (error) {
                console.log(error);
            }
          
        },

        async login(email, password) {
            console.log("auth store login")
            // Hybrid assumption: server sets refresh cookie + returns accessToken (and maybe user)
            const response = await axios.post(
                `${BASE_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            )

            const accessToken = response.data.data.accessToken;
            const user = response.data.data.user;
            
            if(accessToken && user){
                    this.setAuthenticated(accessToken,user)
            } else {
                throw new Error("accessToken or user missing")
            }
            
           

            // If backend doesn't return user, load it via /me (Bearer)
            if (!this.user) {
                const me = await axios.get(`${BASE_URL}/users/me`, {
                    headers: this._authHeaders(),
                    withCredentials: true
                })
                    this.setAuthenticated(accessToken,user)
            }
        },

      async loginWithGoogle(idToken){
               const response = await axios.post(
                `${BASE_URL}/auth/login/google`,
                {
                idToken
                },
                {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true // only if you use cookies/sessions
                }
            )
          

            const accessToken = response.data.data.accessToken;
            const user = response.data.data.user;
            
            if(accessToken && user){
                    this.setAuthenticated(accessToken,user)
            } else {
                throw new Error("accessToken or user missing")
            }
            

            return response.data.data
          
      },

        async refresh() {
            const response = await axios.post(
                `${BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true }
            )
            const accessToken =  response?.data?.data?.accessToken;
            this.setAuthenticated(accessToken)
            return accessToken;
        },

        async logout() {
            // If you have an endpoint; otherwise just clear local state.
            try {
                await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true })
            } catch (_) {
                // ignore network errors; local logout still happens
            }
            this.setUnauthenticated()
        }
    }
})
