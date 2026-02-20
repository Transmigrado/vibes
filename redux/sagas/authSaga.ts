import { call, put, takeLatest } from 'redux-saga/effects';
import { supabase } from '../../lib/supabase';
import { checkSession, loginFailure, loginRequest, loginSuccess } from '../slices/userSlice';

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

function* handleCheckSession(): any {
    try {
        const { data: { session }, error } = yield call(() => supabase.auth.getSession());
        if (session) {
            yield put(loginSuccess(session.user));
        } else {
            yield put(loginFailure('No session'));
        }
    } catch (e: any) {
        yield put(loginFailure(e.message));
    }
}

export function* authSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
    yield takeLatest(checkSession.type, handleCheckSession);
}
