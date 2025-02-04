import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../../constants/routes";
import { REQUEST, SUCCESS, FAIL, CATEGORY_ADMIN_ACTION } from "../constants";

function* getCategorySaga(action) {
  try {
    const result = yield axios.get(`${API_URL}/categories`);
    yield put({
      type: SUCCESS(CATEGORY_ADMIN_ACTION.GET_CATEGORY_LIST),
      payload: {
        data: result.data,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(CATEGORY_ADMIN_ACTION.GET_CATEGORY_LIST),
      payload: {
        errors: error,
      },
    });
  }
}

function* createCategorySaga(action) {
  try {
    const values = action.payload;
    const result = yield axios.post(`${API_URL}/categories`, {
      name: values.category,
    });
    yield put({
      type: SUCCESS(CATEGORY_ADMIN_ACTION.CREATE_CATEGORY_ITEM),
      payload: {
        data: result.data,
      },
    });
    yield put({
      type: REQUEST(CATEGORY_ADMIN_ACTION.GET_CATEGORY_LIST),
    });
    message.success("Thêm loại sản phẩm thành công");
  } catch (error) {
    yield put({
      type: FAIL(CATEGORY_ADMIN_ACTION.CREATE_CATEGORY_ITEM),
      payload: {
        errors: error,
      },
    });
  }
}

function* updateCategorySaga(action) {
  try {
    const { categoryId, categoryName, callback } = action.payload;
    yield axios.patch(`${API_URL}/categories/${categoryId}`, {
      name: categoryName,
    });
    yield put({
      type: SUCCESS(CATEGORY_ADMIN_ACTION.UPDATE_CATEGORY_ITEM),
    });
    yield put({
      type: REQUEST(CATEGORY_ADMIN_ACTION.GET_CATEGORY_LIST),
    });
    yield callback.resetForm();
    yield callback.isEditForm();
    message.success("Chỉnh sửa loại sản phẩm thành công");
  } catch (error) {
    yield put({
      type: FAIL(CATEGORY_ADMIN_ACTION.UPDATE_CATEGORY_ITEM),
      payload: {
        errors: error,
      },
    });
  }
}

function* deleteCategorySaga(action) {
  try {
    const values = action.payload;
    yield axios.delete(`${API_URL}/categories/${values}`);
    yield put({
      type: REQUEST(CATEGORY_ADMIN_ACTION.GET_CATEGORY_LIST),
    });
    message.success("Xóa loại sản phẩm thành công");
  } catch (error) {
    yield put({
      type: FAIL(CATEGORY_ADMIN_ACTION.CREATE_CATEGORY_ITEM),
      payload: {
        errors: error,
      },
    });
  }
}

export default function* categoryAdminSaga() {
  yield takeEvery(
    REQUEST(CATEGORY_ADMIN_ACTION.GET_CATEGORY_LIST),
    getCategorySaga
  );
  yield takeEvery(
    REQUEST(CATEGORY_ADMIN_ACTION.CREATE_CATEGORY_ITEM),
    createCategorySaga
  );
  yield takeEvery(
    REQUEST(CATEGORY_ADMIN_ACTION.DELETE_CATEGORY_ITEM),
    deleteCategorySaga
  );
  yield takeEvery(
    REQUEST(CATEGORY_ADMIN_ACTION.UPDATE_CATEGORY_ITEM),
    updateCategorySaga
  );
}
