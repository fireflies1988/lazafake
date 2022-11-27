export default function handleError(err, thunkAPI, funcName) {
  console.log(funcName ?? "", err);
  const message =
    err?.response?.data?.errors?.map((err) => err.msg) ??
    err?.response?.data?.message ??
    err?.message ??
    err.toString();
  return thunkAPI.rejectWithValue(message);
}
