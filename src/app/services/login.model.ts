export interface ILogin {
    username: string
    password: string
  }
  
  export interface IOtp {
    username: string
    code: number | undefined
  }
  
  export interface IRestPassword {
    password: string
    password_token: string | null
  }
  
  