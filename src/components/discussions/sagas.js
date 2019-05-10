import { eventChannel } from 'redux-saga';
import {
  cancelled,
  race,
  take,
  put,
  call,
  cancel,
  fork,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { socket } from '../../apis/socket';
import {
  fetchDiscussion,
  fetchMessages,
  sendMessage,
  updateMessage,
} from '../../apis/discussions';
import { regSaga } from '../../store';
import {
  ADD_DISCUSSION,
  JOIN_DISCUSSION,
  LEAVE_DISCUSSION,
  SET_DISCUSSION_ERROR,
  FETCH_MORE_MESSAGES,
  SEND_MESSAGE,
  SEND_MESSAGE_UPDATE,
  SET_MORE_MESSAGES,
  SET_TOPIC_STATUS,
  UPDATE_PRESENCE,
  UPDATE_DISCUSSION,
  ADD_MESSAGE,
  MESSAGE_UPDATE,
  REMOVE_MESSAGE,
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  UPDATE_PARTICIPANT,
  ADD_INVITATION,
  REMOVE_INVITATION,
  UPDATE_INVITATION,
  UNSUBSCRIBED,
} from './redux';

export function registerTopicChannel(topic) {
  return eventChannel(emit => {
    topic
      .onPresence((op, presenceData) => {
        emit({ event: 'presence', payload: { op, presenceData } });
      })
      .onStatus(status => emit({ event: 'status', payload: status }))
      .on('message:created', emit)
      .on('message:updated', emit)
      .on('message:deleted', emit)
      .on('participant:created', emit)
      .on('participant:updated', emit)
      .on('participant:deleted', emit)
      .on('invitation:created', emit)
      .on('invitation:updated', emit)
      .on('invitation:deleted', emit)
      .on('relatedItem:created', emit)
      .on('relatedItem:deleted', emit)
      .on('discussion:updated', emit)
      .on('discussion:deleted', emit)
      .on('unsubscribed', emit);

    return () => topic.unsubscribe();
  });
}

export function* handleTopicChannel(channel, id, socket, topic) {
  try {
    while (true) {
      const topicEvent = yield take(channel);
      switch (topicEvent.event) {
        case 'status':
          yield put({
            type: SET_TOPIC_STATUS,
            payload: { id, status: topicEvent.payload },
          });
          break;
        case 'presence':
          yield put({
            type: UPDATE_PRESENCE,
            payload: { id, presences: topic.presence() },
          });
          break;
        case 'discussion:updated':
          yield put({ type: UPDATE_DISCUSSION, payload: topicEvent.payload });
          break;
        case 'message:created':
          yield put({
            type: ADD_MESSAGE,
            payload: { id, message: topicEvent.payload },
          });
          break;
        case 'message:updated':
          yield put({
            type: MESSAGE_UPDATE,
            payload: { id, message: topicEvent.payload },
          });
          break;
        case 'message:deleted':
          yield put({
            type: REMOVE_MESSAGE,
            payload: { id, message: topicEvent.payload },
          });
          break;
        case 'participant:created':
          yield put({
            type: ADD_PARTICIPANT,
            payload: { id, participant: topicEvent.payload },
          });
          break;
        case 'participant:deleted':
          yield put({
            type: REMOVE_PARTICIPANT,
            payload: { id, participant: topicEvent.payload },
          });
          break;
        case 'participant:updated':
          yield put({
            type: UPDATE_PARTICIPANT,
            payload: { id, participant: topicEvent.payload },
          });
          break;
        case 'invitation:created':
          yield put({
            type: ADD_INVITATION,
            payload: { id, invitation: topicEvent.payload },
          });
          break;
        case 'invitation:deleted':
          yield put({
            type: REMOVE_INVITATION,
            payload: { id, invitation: topicEvent.payload },
          });
          break;
        case 'invitation:updated':
          yield put({
            type: UPDATE_INVITATION,
            payload: { id, invitation: topicEvent.payload },
          });
          break;
        case 'unsubscribed':
          yield put({ type: UNSUBSCRIBED, payload: { id } });
          break;
        default:
          console.log(
            `Unhandled socket action '${topicEvent.event}' for ${id}: `,
            topicEvent,
          );
      }
    }
  } finally {
    if (yield cancelled()) {
      // what... what does this mean?
      yield channel.close();
    }
  }
}

const selectMessageToken = discussionId => state =>
  state.getIn(['discussions', discussionId, 'nextPageToken']);

regSaga(
  takeEvery(SEND_MESSAGE, function*(action) {
    yield call(sendMessage, action.payload);
  }),
);

regSaga(
  takeEvery(SEND_MESSAGE_UPDATE, function*(action) {
    yield call(updateMessage, action.payload);
  }),
);
regSaga(
  takeEvery(FETCH_MORE_MESSAGES, function*(action) {
    const pageToken = yield select(selectMessageToken(action.payload));

    const { messages, nextPageToken } = yield call(
      fetchMessages,
      action.payload,
      pageToken,
    );

    yield put({
      type: SET_MORE_MESSAGES,
      payload: { id: action.payload, messages, nextPageToken },
    });
  }),
);

regSaga('WATCH_DISCUSSIONS_SOCKET', function*() {
  let discussionTasks = [];

  while (true) {
    const { joinTopic, leaveTopic } = yield race({
      joinTopic: take(JOIN_DISCUSSION),
      leaveTopic: take(LEAVE_DISCUSSION),
    });

    // The UI requested to join a topic.
    if (joinTopic) {
      const topicId = `discussions/discussion/${joinTopic.payload.id}`;

      const topic = socket.topic(topicId);
      const channel = registerTopicChannel(topic);
      const handler = yield fork(
        handleTopicChannel,
        channel,
        joinTopic.payload.id,
        socket,
        topic,
      );
      discussionTasks.push({
        id: joinTopic.payload.id,
        topic,
        channel,
        handler,
      });
      try {
        yield call(
          topic.subscribe.bind(topic),
          joinTopic.payload.invitationToken,
        );
        const { discussion, error } = yield call(fetchDiscussion, {
          id: joinTopic.payload.id,
        });
        if (error) {
          console.error('Failed to join discussion!');
        } else {
          yield put({ type: ADD_DISCUSSION, payload: discussion });
        }
      } catch (e) {
        yield put({
          type: SET_DISCUSSION_ERROR,
          payload: { id: joinTopic.payload.id, error: e.payload },
        });
      }
    }

    // The UI requested to leave a topic.
    if (leaveTopic) {
      // Fetch the task.
      const discussionTask = discussionTasks.find(
        dt => dt.id === leaveTopic.payload,
      );
      // Ask the channel to close the socket.
      yield cancel(discussionTask.handler);
      // Remove the task from the queue.
      discussionTasks = discussionTasks.filter(
        dt => dt.id !== discussionTask.id,
      );
    }
  }
});
