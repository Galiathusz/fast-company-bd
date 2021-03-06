import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentCreated: (state, action) => {
            state.entities.push(action.payload);
        },
        commentRemoved: (state, action) => {
            state.entities = state.entities.filter(comment => comment._id !== action.payload);
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const { commentsRequested, commentsReceived, commentsRequestFailed, commentCreated, commentRemoved } = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const createComment = (comment) => async (dispatch) => {
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentCreated(content));
    } catch (error) {

    }
};

export const removeComment = (comment) => async (dispatch) => {
    try {
        const { content } = await commentService.removeComment(comment);
        dispatch(commentRemoved(content));
    } catch (error) {

    }
};

export const getComments = () => (state) => {
    return state.comments.entities;
};

export const getCommentsLoadingStatus = () => (state) => state.comments.isLoading;

export default commentsReducer;
