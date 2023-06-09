declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_W3M_PROJECT_ID: string;
            NEXT_PUBLIC_ALCHEMY_API_KEY: string;
            RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: boolean;
            NEXT_PUBLIC_USER:string
            NEXT_PUBLIC_PASS: string;
        }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}