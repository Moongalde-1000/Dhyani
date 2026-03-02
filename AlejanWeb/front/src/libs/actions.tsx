/* eslint-disable */
'use server';

import { signIn, signOut } from '../../auth';
import { AuthError } from 'next-auth';

// ...

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Invalid credentials.' + error.type;
            }
        }
        throw error;
    }
}

export async function logout(
    redirectTo?: string | undefined,
) {
    try {
        return await signOut({ redirectTo: redirectTo });
    } catch (error) {
        if (error instanceof AuthError) {

            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return error.message;
            }
        }
        throw error;
    }
}
