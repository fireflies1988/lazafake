import { logout, reset } from "../auth/authSlice";

export default function handleError(
  err,
  thunkAPI,
  funcName = "",
  checkToken = false
) {
  console.log(funcName, err);

  const message =
    err?.response?.data?.errors?.map((err) => err.msg) ??
    err?.response?.data?.message ??
    err?.message ??
    err.toString();

  if (
    checkToken &&
    err?.repsonse?.status === 401 &&
    message.includes("expired")
  ) {
    thunkAPI.dispatch(logout());
    thunkAPI.dispatch(reset());
  }

  return thunkAPI.rejectWithValue(message);
}
