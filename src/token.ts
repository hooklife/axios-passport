export interface IToken {
    refreshToken: string
    accessToken?: string
    expires?: number
}

export class TokenUtils {
    static accessTokenKey: string = 'ACCESSS_TOKEN';
    static refreshTokenKey: string = 'REFRESH_TOKEN';
    static tokenExpiresAtKey: string = 'TOKEN_EXPIRES_AT';


    static getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey)
    }


    static getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey)
    }

    static getTokenExpires(): number {
        return parseInt(localStorage.getItem(this.tokenExpiresAtKey))
    }

    static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
        localStorage.removeItem(this.tokenExpiresAtKey)
    }

    static setTokens(token: IToken) {
        const expiresAt = new Date().getTime() + (token.expires * 1000)
        localStorage.setItem(this.accessTokenKey, token.accessToken)
        localStorage.setItem(this.refreshTokenKey, token.refreshToken)
        localStorage.setItem(this.tokenExpiresAtKey,expiresAt.toString() )
    }

    static isValidAccessToken() {
        if (!this.getAccessToken()) {
            return false
        }
        const expires = this.getTokenExpires()
        if (new Date().getTime() + 10000 < expires) {
            return true
        }

        return false
    }

}



