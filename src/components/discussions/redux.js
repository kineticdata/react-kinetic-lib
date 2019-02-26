import { List } from 'immutable';
import actionTyper from 'actiontyper';

import { regHandlers } from '../../store';

import { Discussion } from '../../models/discussions';

export const {
  JOIN_DISCUSSION,
  ADD_DISCUSSION,
  UPDATE_DISCUSSION,
  LEAVE_DISCUSSION,
  SET_DISCUSSION_ERROR,
  FETCH_MORE_MESSAGES,
  SET_MORE_MESSAGES,
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  UPDATE_PARTICIPANT,
  ADD_INVITATION,
  REMOVE_INVITATION,
  UPDATE_INVITATION,
  MESSAGE_UPDATE,
  REMOVE_MESSAGE,
  ADD_MESSAGE,
  SEND_MESSAGE,
  SEND_MESSAGE_UPDATE,
  UPDATE_PRESENCE,
  SET_TOPIC_STATUS,
  UNSUBSCRIBED,
} = actionTyper('@kd/discussions/');

const handleJoinDiscussion = (state, { payload }) =>
  state.hasIn(['discussions', payload.id])
    ? state
    : state.setIn(['discussions', payload.id], Discussion());

const handleUpsertDiscussion = (state, { payload }) =>
  state.updateIn(['discussions', payload.id], discussion =>
    discussion.mergeWith(
      (prev, next, key) =>
        ['topic', 'presences'].includes(key) ||
        (type === UPDATE_DISCUSSION &&
          (key === 'messages' || key === 'nextPageToken'))
          ? prev
          : next,
      createDiscussion(payload),
    ),
  );

const handleLeaveDiscussion = (state, { payload }) =>
  state.update('discussions', map => map.delete(payload));

const handleSetDiscussionError = (state, { payload }) =>
  state.setIn(['discussions', payload.id, 'error'], payload.error);

const handleFetchMoreMessages = (state, { payload }) =>
  state.setIn(['discussions', payload, 'loadingMoreMessages'], true);

const handleSetMoreMessages = (state, { payload }) =>
  state.updateIn(['discussions', payload.id], discussion =>
    discussion
      .set('messagesLoading', false)
      .set('loadingMoreMessages', false)
      .update('messages', messages => messages.concat(List(payload.messages)))
      .set('nextPageToken', payload.nextPageToken),
  );

const handleAddParticipant = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'participants'], participants =>
    participants.push(payload.participant),
  );

const handleRemoveParticipant = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'participants'], participants =>
    participants.filter(
      participant =>
        participant.user.username !== payload.participant.user.username,
    ),
  );

const handleUpdateParticipant = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'participants'], participants =>
    participants.map(participant =>
      participant.user.username === payload.participant.user.username
        ? payload.participant
        : participant,
    ),
  );

const handleAddInvitation = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'invitations'], invitations =>
    invitations.push(payload.invitation),
  );

const handleRemoveInvitation = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'invitations'], invitations =>
    invitations.delete(
      invitations.findIndex(i => invitationsMatch(i, payload.invitation)),
    ),
  );

const handleUpdateInvitation = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'invitations'], invitations =>
    invitations.map(invitation =>
      invitationsMatch(invitation, payload.invitation)
        ? payload.invitation
        : invitation,
    ),
  );

const handleMessageUpdate = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'messages'], messages =>
    // If the update is for a message we have, update it.
    messages
      .map(message =>
        message.id === payload.message.id ? payload.message : message,
      )
      // If the update is for a parent of a message we have, update the parent.
      .map(message => {
        if (message.parent && message.parent.id === payload.message.id) {
          message.parent = payload.message;
        }
        return message;
      }),
  );

const handleRemoveMessage = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'messages'], messages =>
    messages.filter(message => message.id !== payload.message.id),
  );

const handleAddMessage = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'messages'], messages =>
    messages.unshift(payload.message),
  );

const handleUpdatePresence = (state, { payload }) =>
  state.updateIn(['discussions', payload.id, 'presences'], () =>
    List(payload.presences),
  );

const handleSetTopicStatus = (state, { payload }) =>
  state.updateIn(['discussions', payload.id], discussion =>
    discussion.setIn(['topic', 'topicStatus'], payload.status),
  );

const handleUnsubscribed = (state, { payload }) =>
  state.setIn(['discussions', payload.id, 'error'], 'Unsubscribed');

regHandlers({
  [JOIN_DISCUSSION]: handleJoinDiscussion,
  [ADD_DISCUSSION]: handleUpsertDiscussion,
  [UPDATE_DISCUSSION]: handleUpsertDiscussion,
  [LEAVE_DISCUSSION]: handleLeaveDiscussion,
  [SET_DISCUSSION_ERROR]: handleSetDiscussionError,
  [FETCH_MORE_MESSAGES]: handleFetchMoreMessages,
  [SET_MORE_MESSAGES]: handleSetMoreMessages,
  [ADD_PARTICIPANT]: handleAddParticipant,
  [REMOVE_PARTICIPANT]: handleRemoveParticipant,
  [UPDATE_PARTICIPANT]: handleUpdateParticipant,
  [ADD_INVITATION]: handleAddInvitation,
  [REMOVE_INVITATION]: handleRemoveInvitation,
  [UPDATE_INVITATION]: handleUpdateInvitation,
  [MESSAGE_UPDATE]: handleMessageUpdate,
  [REMOVE_MESSAGE]: handleRemoveMessage,
  [ADD_MESSAGE]: handleAddMessage,
  [UPDATE_PRESENCE]: handleUpdatePresence,
  [SET_TOPIC_STATUS]: handleSetTopicStatus,
  [UNSUBSCRIBED]: handleUnsubscribed,
});
