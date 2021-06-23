export interface ITokens {
    isValidAccessToken: boolean
    refreshToken?: string
    accessToken?: string
    expires?: number
}
export class TokenUtils {
    accessTokenKey: string = 'ACCESSS_TOKEN';
    refreshTokenKey: string = 'REFRESH_TOKEN';
    tokenExpiresKey: string = 'TOKEN_EXPIRES';


    getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey)
    }


    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey)
    }

    getTokenExpires(): number | null {
        return parseInt(localStorage.getItem(this.tokenExpiresKey))
    }

    removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
        localStorage.removeItem(this.tokenExpiresKey)
    }
    setTokens(tokens: ITokens) {
        localStorage.setItem(this.accessTokenKey, tokens.accessToken)
        localStorage.setItem(this.refreshTokenKey, tokens.refreshToken)
        localStorage.setItem(this.tokenExpiresKey, tokens.expires.toString())
    }



    getTokens(): ITokens {
        const accessToken = this.getAccessToken()
        const refreshToken = this.getRefreshToken()
        const expires = this.getTokenExpires()


        if (!accessToken) {
            return { isValidAccessToken: false }
        }

        let isValidAccessToken = false
        if (new Date().getTime() + 10000 < expires) {
            isValidAccessToken = true

        }
        return { isValidAccessToken: isValidAccessToken, accessToken: accessToken, refreshToken: refreshToken, expires: expires }
    }

}



