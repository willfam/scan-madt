import { createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { IAuth } from '@models';
import { updateAuth, updateLoading, updateIsOnTrip } from './global.action';

export interface GlobalState {
    isLoading: boolean;
    auth: IAuth;
    isOnTrip: boolean;
}

export const initialGlobalState: GlobalState = {
    isLoading: true,
    auth: {
        isLoggedIn: false,
    },
    isOnTrip: false,
};

export const globalReducer = createReducer(
    initialGlobalState,

    on(updateLoading, (state, { payload }) => {
        return {
            ...state,
            isLoading: payload,
        };
    }),
    on(updateAuth, (state, { payload }) => {
        return {
            ...state,
            auth: {
                ...payload,
            },
        };
    }),
);

export const selectGlobalState = (state: AppState) => state.global;

export const isLoading = createSelector(selectGlobalState, (state) => {
    return state.isLoading;
});

export const auth = createSelector(selectGlobalState, (state) => {
    return state.auth;
});

export const isOnTrip = createSelector(selectGlobalState, (state) => {
    return state.isOnTrip;
});

export { updateAuth, updateLoading, updateIsOnTrip };
