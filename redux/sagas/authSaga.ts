import { call, put, takeLatest } from 'redux-saga/effects';
import { supabase } from '../../lib/supabase';
import { loginFailure, loginRequest, loginSuccess } from '../slices/userSlice';

function* handleLogin(action: any): any {
    try {
        const { email, password } = action.payload;
        const { data, error } = yield call(
            () => supabase.auth.signInWithPassword({ email, password })
        );

        if (error) {
            yield put(loginFailure(error.message));
        } else {
            yield put(loginSuccess(data.user));
        }
    } catch (e: any) {
        yield put(loginFailure(e.message));
    }
}

export function* authSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
}
