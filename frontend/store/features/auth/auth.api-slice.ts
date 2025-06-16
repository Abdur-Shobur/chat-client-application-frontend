import { apiSlice } from '../api/apiSlice';
import { AuthType } from './auth.interface';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<AuthType, { email: string; password: string }>({
			query: (payload) => ({
				url: `auth/login`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: [],
		}),

		// auth registration
		registration: builder.mutation<
			AuthType,
			{ email: string; password: string }
		>({
			query: (payload) => ({
				url: `auth/register`,
				method: 'POST',
				body: payload,
			}),
		}),
	}),
	overrideExisting: false,
});

export const { useLoginMutation, useRegistrationMutation } = api;
